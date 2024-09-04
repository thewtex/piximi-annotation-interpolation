from pathlib import Path
import sys

from rich import print
from itkwasm_image_io import write_image, read_image
from itkwasm_morphological_contour_interpolation import morphological_contour_interpolation

def interpolate_volume(input_volume, output_volume):
    volume = read_image(input_volume)

    interpolated = morphological_contour_interpolation(volume, axis=2)

    write_image(interpolated, output_volume)

if len(sys.argv) < 3:
    print("Usage: python interpolate.py <input_volume> <output_volume>")
    sys.exit(1)

input_volume = Path(sys.argv[1])
output_volume = Path(sys.argv[2])
interpolate_volume(input_volume, output_volume)