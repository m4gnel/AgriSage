# Agri-SAGE (Scalable Agricultural Guidance Engine)

[![Architecture: Multi-Agent](https://img.shields.io/badge/Architecture-14--Agent%20LangGraph-2D7D2D.svg)](#)
[![Simulation: DSSAT](https://img.shields.io/badge/Simulation-DSSAT%20Physics--Grounded-1A5C1A.svg)](#)
[![Safety: CIB%26RC](https://img.shields.io/badge/Safety-CIB%26RC%20Label%20Verified-C62828.svg)](#)
[![Localization: Malayalam%20First](https://img.shields.io/badge/Language-Malayalam%20%7C%20English%20%7C%20Tamil%20%7C%20Telugu%20%7C%20Hindi-558B2F.svg)](#)
[![License: Open Source](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](#)

Agri-SAGE is an offline-first, simulation-grounded, multi-agent agricultural decision intelligence platform designed for smallholder farmers, extension officers, and agronomists across India and global developing markets.

Unlike conventional chatbots or standalone disease detection apps, Agri-SAGE unifies **multimodal sensor/image inputs**, **on-device edge machine learning**, **physics-based crop simulation (DSSAT)**, **statutory chemical safety validation (CIB&RC)**, and **7-state calibrated confidence scoring** into a single actionable advisory system.

---

## Master Architecture & Decisions

Complete architectural decisions, technology rationales, ADRs, and execution roadmap are documented in:
👉 **[DECISIONS_AND_ACTIONS.md](DECISIONS_AND_ACTIONS.md)**

---

## Project Structure

```
AgriSage/
├── apps/
│   └── web-expert/            # Agronomist Triage Workstation & Farmer Advisory Sandbox (React + Vite + TS)
├── mobile/                    # Mobile Application (Android Native / Flutter Hybrid)
├── backend/                   # FastAPI backend, 14 LangGraph agents, PostgreSQL + pgvector
│   ├── agents/                # 14 Multi-agent implementations (Vision, Weather, CropStage, Critic, etc.)
│   ├── api/v1/                # REST API endpoints (auth, diagnose, risk, schemes, simulate, expert)
│   ├── data/                  # Standardized data schemas, GDD tables, disease classes, Malayalam dictionaries
│   ├── knowledge/             # ICAR / KAU document ingestion, hybrid RRF retrieval
│   ├── ml/                    # ONNX vision model pipelines and training scripts
│   ├── safety/                # Chemical safety blocker and hallucination detection
│   ├── services/              # LLM wrapper, embeddings, image security, morning briefing
│   └── simulation/            # DSSAT crop growth simulation adapters and scenario generators
├── docs/                      # 13 Master Project Specification Documents (PRD, TRD, UI/UX, etc.)
├── DECISIONS_AND_ACTIONS.md   # Formal Architecture Decision Records (ADRs) & Action Plan
└── LICENSE_REGISTRY.md        # Comprehensive open-source and dependency licensing audit
```

---

## Presentation Surfaces

1. **Expert Review Workstation (`apps/web-expert/`)**:
   - Designed for desktop/tablet displays used by KVK agronomists, university researchers, and FPO directors.
   - Core capabilities: Live triage queue for uncertain diagnoses, split-screen evidence inspection, chemical label verification, and regional disease outbreak radar.
2. **Farmer Mobile Application (`mobile/`)**:
   - Designed for low-spec Android devices (2GB RAM baseline) operating under intermittent connectivity.
   - Core capabilities: Real-time CameraX blur/quality feedback, on-device INT8 ONNX vision inference, offline cache, voice narration in Malayalam, and daily morning briefing cards.

---

## Technical Specifications & Documentation References

Detailed specifications are available in the `docs/` folder:
- **Product Requirements Document (PRD):** [1_AgriSAGE_PRD.docx](docs/1_AgriSAGE_PRD.docx)
- **Technical Requirements Document (TRD):** [2_AgriSAGE_TRD.docx](docs/2_AgriSAGE_TRD.docx)
- **App Flow Architecture:** [3_AgriSAGE_AppFlow.docx](docs/3_AgriSAGE_AppFlow.docx)
- **UI/UX Design System Specification:** [4_AgriSAGE_UIUX_Spec.docx](docs/4_AgriSAGE_UIUX_Spec.docx)
- **Backend Schema & DDL:** [5_AgriSAGE_BackendSchema.docx](docs/5_AgriSAGE_BackendSchema.docx)
- **Implementation & Build Plan:** [6_AgriSAGE_ImplementationPlan.docx](docs/6_AgriSAGE_ImplementationPlan.docx)
- **Security & Regulatory Compliance:** [7_AgriSAGE_Security_Compliance.docx](docs/7_AgriSAGE_Security_Compliance.docx)
- **AI Agent Prompt Handbook:** [8_AgriSAGE_AI_Prompt_Handbook.docx](docs/8_AgriSAGE_AI_Prompt_Handbook.docx)
- **Testing & QA Playbook:** [9_AgriSAGE_Testing_QA_Playbook.docx](docs/9_AgriSAGE_Testing_QA_Playbook.docx)
- **Master Build Guide:** [11.1_AgriSAGE_Master_Build_Guide.docx](docs/11.1_AgriSAGE_Master_Build_Guide.docx)
