from fastapi import APIRouter, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from app.utils.file_parser import parse_uploaded_file
from app.services.gemini_service import get_gemini_summary
from app.services.email_service import send_summary_email
from app.middleware.security import limiter
import re

router = APIRouter()

def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email))


@router.post(
    "/upload",
    summary="Upload sales file and trigger AI summary email",
    response_description="Success message confirming email was sent",
    responses={
        200: {"description": "Summary generated and emailed successfully"},
        400: {"description": "Invalid file or email"},
        413: {"description": "File too large"},
        429: {"description": "Rate limit exceeded"},
        502: {"description": "External API error (Gemini or SMTP)"},
    }
)
@limiter.limit("5/minute")
async def upload_and_process(
    request: Request,
    file: UploadFile = File(..., description="CSV or XLSX sales data file"),
    email: str = Form(..., description="Recipient email address for the AI summary"),
):
    # Validate email
    if not is_valid_email(email):
        return JSONResponse(
            status_code=400,
            content={"detail": "Invalid email address provided."}
        )
    
    # Parse file
    data_string = await parse_uploaded_file(file)
    
    # Generate AI summary
    summary = get_gemini_summary(data_string)
    
    # Send email
    await send_summary_email(email, summary)
    
    return {
        "message": "✅ Summary generated and sent successfully!",
        "recipient": email,
        "preview": summary[:300] + "..." if len(summary) > 300 else summary
    }