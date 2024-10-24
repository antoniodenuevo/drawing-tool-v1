import random
import json
from PIL import Image

# List of image filenames (you can change this if necessary)
image_files = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg', 'assets/4.jpg', 'assets/5.jpg']

# Dictionary to store the colors for each image
colors_data = {}

# Function to get 50 random colors from an image
def extract_random_colors(image_path, num_colors=50):
    img = Image.open(image_path)
    img = img.convert('RGB')  # Ensure it's in RGB mode
    width, height = img.size
    colors = []

    for _ in range(num_colors):
        # Choose random pixel coordinates
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        # Get the color of the pixel
        pixel_color = img.getpixel((x, y))
        colors.append(list(pixel_color))  # Convert to a list [R, G, B]

    return colors

# Loop over the image files and extract colors
for i, image_file in enumerate(image_files):
    img_key = f"img{i+1}"  # Create keys like 'img1', 'img2', ...
    colors_data[img_key] = extract_random_colors(image_file)

# Save the colors data to a JSON file
with open('colors.json', 'w') as json_file:
    json.dump(colors_data, json_file, indent=4)

print("colors.json file has been created successfully.")
