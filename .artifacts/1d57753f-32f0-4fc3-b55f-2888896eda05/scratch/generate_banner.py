from PIL import Image, ImageDraw, ImageFont
import os

width = 1024
height = 500

# Create image with primary theme color background (Deep Blue)
image = Image.new("RGB", (width, height), color="#0F172A")
draw = ImageDraw.Draw(image)

# Draw some subtle decorative shapes/gradients
draw.rectangle([(0, height - 120), (width, height)], fill="#1E3A8A")
draw.ellipse([(width - 300, -100), (width + 200, 400)], fill="#3B82F6")

# Try to load a font, fall back to default if not available
try:
    font_title = ImageFont.truetype("arial.ttf", 72)
    font_sub = ImageFont.truetype("arial.ttf", 32)
except:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()

# Draw title and subtitle
draw.text((80, 160), "Bienestau", fill="#FFFFFF", font=font_title)
draw.text((80, 260), "Bienestar Universitario", fill="#93C5FD", font=font_sub)
draw.text((80, 320), "Noticias, Eventos y Avisos Institucionales", fill="#E2E8F0", font=font_sub)

# Save image
output_path = os.path.abspath("C:/Users/sergi/Desktop/Practicas/bienestau-frontend-master/assets/images/google_play_feature_graphic.jpg")
os.makedirs(os.path.dirname(output_path), exist_ok=True)
image.save(output_path, "JPEG", quality=95)
print(f"Feature graphic generated successfully at: {output_path}")
