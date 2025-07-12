# import os
# from flask import Flask, request, jsonify, send_from_directory
# import torch
# import clip
# from PIL import Image


# # Setup
# app = Flask(__name__)
# UPLOAD_FOLDER = "wardrobe_images"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# device = "cuda" if torch.cuda.is_available() else "cpu"
# model, preprocess = clip.load("ViT-B/32", device=device)
# wardrobe_db = []  # (filename, embedding)

# # Helper: embed an image using CLIP
# def embed_image(image: Image.Image):
#     image_tensor = preprocess(image).unsqueeze(0).to(device)
#     with torch.no_grad():
#         return model.encode_image(image_tensor).cpu()

# # Upload wardrobe images
# @app.route("/wardrobe", methods=["POST"])
# def upload_wardrobe():
#     files = request.files.getlist("images")
#     for file in files:
#         filename = file.filename
#         filepath = os.path.join(UPLOAD_FOLDER, filename)
#         file.save(filepath)

#         image = Image.open(filepath).convert("RGB")
#         embedding = embed_image(image)
#         wardrobe_db.append((filename, embedding))

#     return jsonify({"message": "Uploaded", "count": len(files)})

# # Upload goal image and return top 5 matches
# @app.route("/upload_goal", methods=["POST"])
# def upload_goal():
#     file = request.files["image"]
#     image = Image.open(file.stream).convert("RGB")
#     goal_emb = embed_image(image)

#     matches = []
#     for fname, emb in wardrobe_db:
#         score = torch.nn.functional.cosine_similarity(goal_emb, emb).item()
#         matches.append((fname, score))

#     top = sorted(matches, key=lambda x: x[1], reverse=True)[:5]
#     return jsonify({"matches": [{"filename": f, "score": s} for f, s in top]})

# # Serve wardrobe image
# @app.route("/wardrobe/<filename>")
# def serve_image(filename):
#     return send_from_directory(UPLOAD_FOLDER, filename)

# # List wardrobe filenames
# @app.route("/wardrobe", methods=["GET"])
# def list_wardrobe():
#     filenames = [fname for fname, _ in wardrobe_db]
#     return jsonify({"wardrobe": filenames})

# if __name__ == "__main__":
#     app.run(debug=True)
