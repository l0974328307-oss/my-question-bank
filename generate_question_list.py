import os

root = "questions"

result = []

for chapter in sorted(os.listdir(root)):

    chapter_path = os.path.join(root, chapter)

    if not os.path.isdir(chapter_path):
        continue

    for file in sorted(os.listdir(chapter_path)):

        if file.endswith(".png"):

            result.append(
                f'''    {{
        file: "questions/{chapter}/{file}",
        chapter: "{chapter}"
    }}'''
            )

output = "const questions = [\n\n"
output += ",\n\n".join(result)
output += "\n\n];"

with open("questions_data.js", "w", encoding="utf-8") as f:
    f.write(output)

print("完成，共產生", len(result), "題")