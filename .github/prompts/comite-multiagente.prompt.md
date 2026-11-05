---
description: Genera y orquesta un Comité de Crédito y Riesgos Bancarios Multi-Agente en Python con LangGraph (StateGraph, Checkpoints, Abogado del Diablo y Human-in-the-Loop) o simulador interactivo web
agent: agent
---

# /comite-multiagente · Orquestador de Comités de Riesgo y Crédito Multi-Agente (LangGraph StateGraph)

Actúa como **Principal AI Architect & Senior Credit Risk Officer**.
Tu objetivo es generar la arquitectura completa, ejecutable y sin código omitido de un **Comité de Riesgos y Crédito Multi-Agente** para banca comercial, corporativa (CIB) o sindicaciones de deuda.

---

## 1. Reglas de Implementación del Grafo

1. **Grafo de Estado Determinista (LangGraph):**
   * Utiliza `StateGraph(CreditCommitteeState)` con esquema tipado (`TypedDict`).
   * Queda estrictamente prohibido usar un único prompt generalista.
   * Debes instanciar obligatoriamente los 5 agentes especializados:
     1. `FinancialAuditorAgent` (Balances, EBITDA normalizado, DSCR).
     2. `MacroSectorAnalyst` (Sensibilidad a tipos del BCE, sector y materias primas).
     3. `CovenantsComplianceOfficer` (Límites Basilea IV, ratios DFN/EBITDA, garantías reales).
     4. `RiskChallengerAgent` ("El Abogado del Diablo" - Ataque obligatorio de puntos ciegos y objeciones críticas).
     5. `CommitteeChairAgent` (Consenso ponderado, dictamen y redacción del *Credit Memo*).
2. **Compuerta Human-in-the-Loop (HITL):**
   * El grafo debe suspender su ejecución antes de comprometer capital o firmar la póliza (`interrupt_before=["human_approval_gate"]`).
   * Requiere autorización explícita de un director de riesgos con firma digital simulada (`SHA-256`).
3. **Resiliencia ante Datos Faltantes o Maliciosos:**
   * Si la empresa prestataria tiene ratios al límite (ej. DFN/EBITDA > 3.4x con límite en 3.5x), el `RiskChallengerAgent` debe forzar un escenario de estrés macro con subida de +150 bps y exigir garantías pignoraticias adicionales.

---

## 2. Formato de Entrega (según lo que pida el usuario)

- **Si pide código Python:** Genera el script completo (`credit_committee_langgraph.py`) con dependencias (`langgraph`, `langchain-core`, `pydantic`), funciones nodo puras, simulación de LLM o integración real con OpenAI/Azure/Claude, y ejecución de prueba con una operación de €25M a €80M.
- **Si pide dashboard / simulador web:** Genera un archivo `.html` 100% autónomo (HTML5 + CSS3 + Vanilla JS) que muestre el **Grafo de Agentes en vivo**, con nodos iluminándose en tiempo real conforme debaten, panel de objeciones del *Risk Challenger* y modal de aprobación final del Director de Riesgos.
