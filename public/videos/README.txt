Put your sea video here as sea.mp4 (and optionally sea.webm).
Use footage you own or a free-licence clip (check the licence). Aim for 10-20 s, 1080p, under 5 MB, no audio:
ffmpeg -i input.mp4 -an -vf scale=1920:-2 -c:v libx264 -crf 28 -movflags +faststart sea.mp4
If no file is present the site shows the 3D ocean instead.
