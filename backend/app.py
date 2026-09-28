# ============================================================
# STAR — Hugging Face Spaces Entry Point
# Runs FastAPI + WebSocket server on port 7860 (Hugging Face default)
# Mounts a Gradio preview dashboard for Hugging Face compatibility
# ============================================================
import os
import uvicorn
from app.main import app as fastapi_app

# Check if gradio is available; if so, mount a clean status dashboard
try:
    import gradio as gr

    with gr.Blocks(title="STAR AML Intelligence Backend") as demo:
        gr.Markdown("# 🛡️ STAR — Suspicious Transaction Analysis & Response")
        gr.Markdown(
            "Production-grade Anti-Money Laundering Intelligence Engine with "
            "**GATe Temporal GNN**, **Isolation Forest**, and **Deterministic AML Rule Engine**."
        )
        gr.Markdown("### 📡 Active API Endpoints")
        gr.Markdown(
            "- **Interactive Swagger UI:** [View Docs](/docs)\n"
            "- **Health Check:** [Check Liveness](/health)\n"
            "- **System Diagnostic:** [View Status](/system/health)\n"
            "- **Live WebSocket Stream:** `/ws/stream`\n"
            "- **GNN WebSocket Inference:** `/ws/inference`"
        )

    # Mount Gradio dashboard at /gradio so root API routes remain unaffected
    app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")
except ImportError:
    # If gradio not installed, run pure FastAPI
    app = fastapi_app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
