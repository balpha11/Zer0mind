# app/utils/helpers.py

from bson import ObjectId, errors as bson_errors
from fastapi import HTTPException

def str_to_objectid(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

def objectid_to_str(obj_id: ObjectId) -> str:
    return str(obj_id)
