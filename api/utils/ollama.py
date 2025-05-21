import httpx
from config import get_settings
import asyncio
import re
from fastapi import HTTPException, status

"""
Ollama Integration Module

This module provides utilities for interacting with the Ollama API
for text correction in the StyleGuard application.
"""

settings = get_settings()

async def detect_language(text: str) -> str:
    """
    Detects the language of the input text.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        str: ISO language code or 'unknown'
    """
    # Common language patterns and markers
    patterns = {
        'fr': r'\b(je|tu|nous|vous|ils|elles|le|la|les|un|une|des|et|ou|mais|donc|car|est|sont)\b',
        'en': r'\b(the|a|an|of|to|in|is|are|and|or|but|for|with|that|this)\b',
        'es': r'\b(el|la|los|las|un|una|unos|unas|y|o|pero|porque|como|está|están)\b',
        'de': r'\b(der|die|das|ein|eine|und|oder|aber|ist|sind|für|mit|dass)\b',
        'it': r'\b(il|la|lo|i|gli|le|un|una|e|o|ma|perché|come|è|sono)\b',
        'ru': r'\b(я|ты|он|она|оно|мы|вы|они|и|или|но|что|как|это|этот|эта|эти|в|на|с|из|от|для)\b',
        'pl': r'\b(ja|ty|on|ona|ono|my|wy|oni|one|i|lub|ale|że|jak|to|ten|ta|to|te|w|na|z|od|dla)\b',
    }
    
    # Count matches for each language
    matches = {}
    for lang, pattern in patterns.items():
        matches[lang] = len(re.findall(pattern, text.lower()))
    
    # Determine most likely language
    if not matches or max(matches.values()) == 0:
        return 'unknown'
    
    return max(matches, key=matches.get)

async def correct_text(text: str) -> str:
    """
    Sends text to Ollama API for correction while preserving style.
    
    Args:
        text (str): The original text to correct
        
    Returns:
        str: The corrected text
        
    Raises:
        HTTPException: If the Ollama API request fails
    """
    # Detect language for better correction context
    language = await detect_language(text)
    
    # Language-specific instructions
    lang_instructions = {
        'fr': "Ce texte est en français. Corrigez uniquement les fautes d'orthographe et de grammaire.",
        'en': "This text is in English. Correct only spelling and grammar mistakes.",
        'es': "Este texto está en español. Corrige solo los errores ortográficos y gramaticales.",
        'de': "Dieser Text ist auf Deutsch. Korrigiere nur Rechtschreib- und Grammatikfehler.",
        'it': "Questo testo è in italiano. Correggi solo errori di ortografia e grammatica.",
        'ru': "Этот текст на русском языке. Исправьте только орфографические и грамматические ошибки.",
        'pl': "Ten tekst jest w języku polskim. Popraw tylko błędy ortograficzne i gramatyczne.",
        'unknown': "Correct only spelling and grammar mistakes in this text, regardless of language."
    }
    
    lang_instruction = lang_instructions.get(language, lang_instructions['unknown'])
    
    prompt = f"""# Correction de texte
    
{lang_instruction}

## INSTRUCTIONS IMPORTANTES:
1. Conserve EXACTEMENT le style, le dialecte, et le registre de langue de l'auteur
2. Maintiens les expressions idiomatiques, argot et tournures spécifiques
3. Ne change PAS le ton ou le niveau de formalité
4. Corrige UNIQUEMENT:
   - Les fautes d'orthographe
   - Les erreurs grammaticales évidentes
   - La ponctuation incorrecte
5. NE REFORMULE PAS le texte
6. NE SIMPLIFIE PAS le vocabulaire
7. NE CHANGE PAS le dialecte ou l'accent
8. NE RENVOIE QUE le texte corrigé

## TEXTE À CORRIGER:
{text}

## RÉPONSE (texte corrigé uniquement):"""

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                settings.ollama_api_url,
                json={
                    "model": settings.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.1  # Lower temperature for more precise corrections
                }
            )
            response.raise_for_status()
            corrected = response.json()["response"].strip()
            
            # Si la réponse est vide ou trop différente de l'original, retourner l'original
            if not corrected or len(corrected) < len(text) * 0.5 or len(corrected) > len(text) * 2:
                print(f"Warning: Suspicious correction result, returning original text")
                return text
                
            return corrected
    except httpx.ConnectError:
        print("Error: Cannot connect to Ollama API. Service unavailable.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OLLAMA_CONNECTION_ERROR"
        )
    except httpx.ReadTimeout:
        print("Error: Timeout connecting to Ollama API.")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="OLLAMA_TIMEOUT_ERROR"
        )
    except Exception as e:
        print(f"Error connecting to Ollama API: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OLLAMA_GENERAL_ERROR"
        ) 