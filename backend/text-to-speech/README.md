## Backend Text-to-Speech Setup

This service must be installed with Python 3.11.

The local machine default is Python 3.14.3, which breaks `chatterbox-tts` during installation because one of its build dependencies is not compatible with Python 3.14 yet.

Use this setup flow instead:

```bash
cd backend/text-to-speech
python3.11 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt
```

The requirements file is pinned to CPU-only PyTorch wheels so local installs do not download large CUDA packages and hit disk quota limits.

If you already created `backend/venv` with Python 3.14, do not reuse it for this service.
