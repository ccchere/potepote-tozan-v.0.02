import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, RecommendationResponse } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getMountainRecommendations(prefs: UserPreferences): Promise<RecommendationResponse> {
  const languageName = prefs.language === 'ja' ? '日本語' : 'English';
  const prompt = `
    Recommend mountain climbing routes in Japan.
    Please answer in ${languageName}.

    User Attributes:
    - Season: ${prefs.season}
    - Fitness Level: ${prefs.fitnessLevel}
    - Experience: ${prefs.experience}
    - Climbing Frequency: ${prefs.frequency}
    - Preferred Elevation Gain: ${prefs.elevationGainPref}
    - Transportation: ${prefs.transportation === 'public' ? 'Public Transport/Train' : 'Car'}
    - Preferred Region: ${prefs.region}
    - Trip Duration: ${prefs.duration === 'day_trip' ? 'Day Trip' : 'Overnight Stay'}
    - Cable Car/Ropeway Preference: ${prefs.cableCar === 'prefer' ? 'Prefer using for ease' : prefs.cableCar === 'avoid' ? 'Avoid and prefer hiking/walking up' : 'Flexible/Either is fine'}
    - Priority: ${prefs.priority === 'scenery' ? 'Great Scenery' : 'Sense of Achievement'}

    Please provide 2 sections in JSON format. Select routes suitable for the current season (${prefs.season}).
    Translate all text fields (name, location, difficulty, description, transportAccess, mandatoryGear, features, reason) into ${languageName}:
    1. "recommendations": Routes for beginners or matching current preference.
    2. "nextSteps": Step-up routes or slightly more challenging ones.

    *Important*: 
    - difficultyLevel: 1 to 5 (1: very easy, 5: very hard).
    - elevationGain: Cumulative elevation gain in meters.
    - transportAccess: Specific details about access (e.g., station name or parking info).
    - mandatoryGear: Array of essential equipment for THIS specific route.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                elevation: { type: Type.NUMBER },
                elevationGain: { type: Type.NUMBER },
                difficulty: { type: Type.STRING },
                difficultyLevel: { type: Type.NUMBER },
                estimatedTime: { type: Type.STRING },
                transportAccess: { type: Type.STRING },
                mandatoryGear: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                reason: { type: Type.STRING }
              },
              required: ["name", "location", "elevation", "elevationGain", "difficulty", "difficultyLevel", "estimatedTime", "transportAccess", "mandatoryGear", "description", "features", "reason"]
            }
          },
          nextSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                elevation: { type: Type.NUMBER },
                elevationGain: { type: Type.NUMBER },
                difficulty: { type: Type.STRING },
                difficultyLevel: { type: Type.NUMBER },
                estimatedTime: { type: Type.STRING },
                transportAccess: { type: Type.STRING },
                mandatoryGear: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                reason: { type: Type.STRING }
              },
              required: ["name", "location", "elevation", "elevationGain", "difficulty", "difficultyLevel", "estimatedTime", "transportAccess", "mandatoryGear", "description", "features", "reason"]
            }
          }
        },
        required: ["recommendations", "nextSteps"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as RecommendationResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("登山情報の取得に失敗しました。");
  }
}
