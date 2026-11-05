---
name: multiagent-risk-committee
description: Orquestación y generación de sistemas multi-agente autónomos para Comités de Crédito y Riesgos Bancarios. Implementa grafos de estado deterministas (LangGraph StateGraph / Python), checkpoints, debate dialéctico ("Abogado del Diablo"), validación de covenants y compuertas Human-in-the-Loop (HITL).
---

# Skill: Multi-Agent Risk & Credit Committee (LangGraph StateGraph Engine)

Usa esta skill siempre que el usuario pida:
1. Diseñar, programar o simular un **Comité de Riesgos o Crédito Bancario Multi-Agente**.
2. Orquestar agentes autónomos con **grafos de estado deterministas** (LangGraph / StateGraph) para tareas de suscripción de crédito (*underwriting*), fusiones y adquisiciones (M&A), o auditoría de riesgos regulatorios (Basilea IV / IFRS 9).
3. Implementar debates dialécticos con un rol de **"Abogado del Diablo" (Risk Challenger)** y compuertas obligatorias de intervención humana (**Human-in-the-Loop - HITL**).

---

## 🏛️ 1. Arquitectura de Roles Especializados del Comité

Queda terminantemente prohibido usar un único agente generalista ("haz de comité de crédito"). Todo sistema debe instanciar y orquestar como mínimo estos **5 agentes especializados**:

| Agente | Rol Operativo | Entradas | Salidas Críticas |
| :--- | :--- | :--- | :--- |
| **`1. FinancialAuditorAgent`** | Extracción y normalización de estados financieros (Balance, P&L, Cash Flow). | Cuentas anuales, CIRBE, XBRL, balances trimestrales. | Métricas normalizadas: EBITDA ajustado, DSCR, Quick Ratio, Deuda Financiera Neta (DFN). |
| **`2. MacroSectorAnalyst`** | Proyecciones macroeconómicas y sensibilidad sectorial. | Tipos de interés BCE, inflación, exposición a materias primas, morosidad sectorial del BdE. | Matriz de estrés macro (+100/+200 bps) y factor de correlación sectorial. |
| **`3. CovenantsComplianceOfficer`** | Verificación jurídica y límites de Basilea IV. | Términos de la facilidad, LTV, covenants pactados, garantías reales (*collateral*). | Veredicto de límites: DFN/EBITDA < 3.5x, cobertura de intereses > 3.0x, RORWA estimado. |
| **`4. RiskChallengerAgent`** *(Obligatorio)* | **"El Abogado del Diablo"**: Audita agresivamente la operación buscando fraudes contables, concentración de clientes o debilidades operativas. | Informes de los agentes 1, 2 y 3. | Lista de 3 a 5 objeciones críticas bloqueantes (*Red Flags* y escenarios de quiebra). |
| **`5. CommitteeChairAgent`** | Presidente del Comité y Sintetizador. | Debate completo de los agentes 1 a 4. | **Dictamen vinculante (Acta de Comité)**: Aprobada, Denegada o Condicionada a garantías adicionales. |

---

## 🔄 2. Especificación del Grafo de Estado (LangGraph StateGraph)

Todo código Python generado debe seguir esta estructura canónica de grafo con soporte para *checkpoints* de memoria y parada humana (*Human-in-the-loop*):

```python
from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph import StateGraph, END
import operator

# 1. Esquema del Estado Compartido
class CreditCommitteeState(TypedDict):
    borrower_name: str
    facility_amount_eur: float
    facility_type: str  # RCF, Term Loan, Syndicated CAPEX
    financial_ratios: Dict[str, float]
    macro_stress_results: Dict[str, Any]
    covenants_ok: bool
    covenant_violations: List[str]
    challenger_objections: List[str]
    human_approved: bool
    committee_decision: str  # APPROVED | REJECTED | CONDITIONAL
    final_credit_memo: str
    audit_trail: Annotated[List[str], operator.add]

# 2. Definición del Grafo de Estado
def build_credit_committee_graph() -> StateGraph:
    workflow = StateGraph(CreditCommitteeState)
    
    # Nodos
    workflow.add_node("audit_financials", financial_auditor_node)
    workflow.add_node("macro_analysis", macro_analyst_node)
    workflow.add_node("verify_covenants", covenants_compliance_node)
    workflow.add_node("challenge_risk", risk_challenger_node)
    workflow.add_node("committee_synthesis", committee_chair_node)
    workflow.add_node("human_decision_gate", human_approval_checkpoint_node)
    
    # Transiciones (Evaluación en Paralelo -> Desafío Dialéctico -> Síntesis -> HITL)
    workflow.set_entry_point("audit_financials")
    workflow.add_edge("audit_financials", "macro_analysis")
    workflow.add_edge("macro_analysis", "verify_covenants")
    workflow.add_edge("verify_covenants", "challenge_risk")
    workflow.add_edge("challenge_risk", "committee_synthesis")
    
    # Compuerta Condicional: Solo si el comité propone aprobar, se exige firma humana (HITL)
    def route_after_synthesis(state: CreditCommitteeState):
        if state["committee_decision"] == "REJECTED":
            return END
        return "human_decision_gate"
        
    workflow.add_conditional_edges("committee_synthesis", route_after_synthesis)
    workflow.add_edge("human_decision_gate", END)
    
    return workflow
```

---

## 🛡️ 3. Reglas Inquebrantables del "Risk Challenger" (Anti-Alucinación)

1. **Prohibido el consenso pasivo:** El `RiskChallengerAgent` **TIENE PROHIBIDO** responder "Todo parece correcto" o "No encuentro objeciones". Si las cifras son impecables, debe atacar el riesgo de concentración de clientes (*Top 3 clientes > 40% ventas*), el riesgo de renovación de deuda a tipo variable o la credibilidad del plan de negocio.
2. **Pruebas de estrés obligatorias:**
   * ¿Qué ocurre si el EBITDA se contrae un 25%?
   * ¿Qué ocurre si los tipos de interés de la deuda suben +150 bps?
   * ¿Soporta la empresa el servicio de la deuda (DSCR > 1.15x) en ese escenario adverso?

---

## 📄 4. Plantilla de Salida: Acta de Comité Ejecutiva (`CreditMemo.md`)

Todo flujo multi-agente debe concluir generando un informe institucional estructurado con las siguientes secciones obligatorias:

```markdown
# ACTA DE COMITÉ DE RIESGOS · OPERACIÓN #[ID]
**Prestatario:** [Nombre Corporativo] | **Importe Solicitado:** €[Monto]M
**Tipo de Facilidad:** [Sindicada / Préstamo Término] | **Plazo:** [N] meses

### 1. Resumen Ejecutivo & Scoring Agencial
- **Rating Interno Asignado:** [AAA a CCC] (PD estimada: X.XX%)
- **Consumo RORWA Basilea IV:** XX.X% (Hurdle institucional: 15.0%)
- **Dictamen del Comité:** [APROBADA CON CONDICIONES | RECHAZADA]

### 2. Matriz de Debate Dialéctico
- **Auditoría Financiera:** EBITDA €XM, DFN/EBITDA X.Xx.
- **Sensibilidad Macro:** Resiste shock BCE +150 bps con DSCR de X.Xx.
- **Objeciones Críticas del Abogado del Diablo (Risk Challenger):**
  1. [Objeción 1 sobre liquidez o concentración]
  2. [Objeción 2 sobre garantías]

### 3. Mitigantes y Condiciones Resolutorias Exigidas
- Pignoración de derechos de cobro o contragarantía matriz.
- Cláusula de *Cross-Default* y revisión semestral de covenants.

### 4. Firma Human-in-the-Loop (HITL)
- **Estado de Aprobación Humana:** [PENDIENTE / AUTORIZADO POR DIRECTOR DE RIESGOS]
- **Hash de Auditoría:** `SHA-256: 8f4c...`
```
