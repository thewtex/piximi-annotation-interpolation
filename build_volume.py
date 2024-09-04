from pathlib import Path
import json
import sys

from rich import print
import numpy as np
from itkwasm_image_io import write_image, read_image
from itkwasm import Image, ImageType

def build_volume(input_dir, output_file):
    # Read the JSON file
    with open(input_dir / 'imageData.json') as f:
        data = json.load(f)

    for volume_description in data:
        volume_info = data[volume_description]

        image_type = ImageType(dimension=3, componentType='uint8', pixelType='Scalar', components=1)
        volume = Image(image_type, size=[volume_info['width'], volume_info['height'], volume_info['planes']])

        volume.data = np.zeros(tuple(reversed(volume.size)), dtype=np.uint8)
        
        for plane_index in volume_info['annotationPlanes']:
            plane_filepath = input_dir / volume_description / volume_info['annotationPlanes'][plane_index]
            plane_image = read_image(plane_filepath)
            volume.data[int(plane_index),:,:] = plane_image.data

        print(volume.data.max())
        write_image(volume, output_file)

if len(sys.argv) < 3:
    print("Usage: python build_volume.py <input_dir> <output.nrrd>")
    sys.exit(1)

input_dir = Path(sys.argv[1])
output_file = Path(sys.argv[2])
build_volume(input_dir, output_file)