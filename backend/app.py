# ============================================================
# STAR — Hugging Face Spaces Entry Point
# Runs FastAPI + WebSocket server on port 7860 (Hugging Face default)
# ============================================================
import os
import uvicorn

# ZeroGPU compatibility: satisfy Hugging Face ZeroGPU startup probe
try:
    import spaces

    @spaces.GPU(duration=5)
    def _gpu_probe():
        return True
except (ImportError, Exception):
    pass

from app.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")


