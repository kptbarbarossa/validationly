# 🚨 VALIDATIONLY DEVELOPMENT RULES

## ⚠️ CRITICAL RULES - NEVER CHANGE THESE!

### 1. **GEMINI MODEL RULE** 🤖
- **ALWAYS USE**: `gemini-1.5-flash` as PRIMARY model (Gemini 2.5 Flash)
- **FALLBACK**: `gemini-2.0-flash-exp` as secondary
- **NEVER CHANGE** the model order or names
- **REASON**: Gemini 2.5 Flash (1.5-flash) provides best results

```typescript
// ✅ CORRECT - DO NOT CHANGE
const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp"];

// ❌ WRONG - NEVER DO THIS
const models = ["gemini-2.0-flash-exp", "gemini-1.5-flash"];
```

### 2. **LANGUAGE SUPPORT RULE** 🌍
- **ALWAYS INCLUDE** full language instruction in system prompt
- **MANDATORY TEXT**: "Always respond in the same language as the user's input. If the user writes in Turkish, respond in Turkish. If they write in English, respond in English. If they write in Spanish, respond in Spanish, etc. Maintain the same language throughout your entire response including all fields."
- **NEVER REMOVE** or simplify language instructions
- **REASON**: Multi-language support is core feature

```typescript
// ✅ CORRECT - ALWAYS INCLUDE THIS
const systemInstruction = `...
IMPORTANT: Always respond in the same language as the user's input. If the user writes in Turkish, respond in Turkish. If they write in English, respond in English. If they write in Spanish, respond in Spanish, etc. Maintain the same language throughout your entire response including all fields.
...`;

// ❌ WRONG - NEVER SIMPLIFY
const systemInstruction = `...
IMPORTANT: Always respond in the user's language.
...`;
```

### 3. **SYSTEM INSTRUCTION RULE** 📝
- **NEVER OVERSIMPLIFY** the system instruction
- **ALWAYS MAINTAIN** detailed analysis methodology
- **REQUIRED SECTIONS**:
  - Language instruction (see rule 2)
  - Detailed demand scoring (0-100 with ranges)
  - Platform-specific analysis (X, Reddit, LinkedIn)
  - Critical rules section
- **REASON**: Detailed instructions = better AI responses

### 4. **SCHEMA COMPLEXITY RULE** ⚖️
- **BALANCE** between functionality and reliability
- **IF 500 ERROR**: Simplify schema, NOT system instructions
- **NEVER REMOVE**: Core fields (demandScore, signalSummary, suggestions)
- **OPTIONAL FIELDS**: Mark advanced features as optional in types
- **REASON**: Schema too complex = AI parsing errors

### 5. **ERROR HANDLING RULE** 🛠️
- **ALWAYS** include fallback values for missing fields
- **NEVER** fail completely if optional fields missing
- **REQUIRED**: Graceful degradation
- **DEBUG**: Always log AI responses for troubleshooting

## 🎯 WHAT TO DO WHEN FIXING BUGS

### If 500 Error:
1. ✅ Add more debug logging
2. ✅ Make optional fields truly optional
3. ✅ Add fallback values
4. ❌ DON'T simplify system instructions
5. ❌ DON'T change Gemini model

### If Language Issues:
1. ✅ Check system instruction has full language text
2. ✅ Verify "same language" instruction exists
3. ❌ DON'T remove language complexity

### If Performance Issues:
1. ✅ Optimize schema structure
2. ✅ Reduce required fields
3. ❌ DON'T change from Gemini 2.5 Flash primary

## 📋 CHECKLIST BEFORE ANY CHANGE

- [ ] Gemini 2.5 Flash (1.5-flash) still primary?
- [ ] Full language instruction still present?
- [ ] System instruction still detailed?
- [ ] Core functionality preserved?
- [ ] Error handling improved, not removed?

## 🚫 NEVER DO THESE

1. ❌ Change Gemini model order
2. ❌ Remove language instructions
3. ❌ Oversimplify system prompts
4. ❌ Remove core fields from schema
5. ❌ Break backward compatibility

## ✅ ALWAYS DO THESE

1. ✅ Use Gemini 2.5 Flash (1.5-flash) first
2. ✅ Include full language support
3. ✅ Maintain detailed analysis methodology
4. ✅ Add graceful error handling
5. ✅ Test in both Turkish and English

---

**Last Updated**: January 31, 2025
**Status**: MANDATORY - DO NOT IGNORE