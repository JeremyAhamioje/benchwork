import type { ProjectEstimate } from "@/lib/types";

/**
 * Illustrative breakdown served when GEMINI_API_KEY is absent, so the whole
 * estimator flow can be developed and demoed without a key or any spend.
 *
 * It is always labelled as a sample in the UI — never presented as an analysis
 * of the user's actual document.
 */
export const sampleEstimate: ProjectEstimate = {
  project_title: "Motorised cassava grating machine",
  project_summary:
    "A bench-mounted grating machine driven by a single-phase electric motor, with a welded mild-steel frame, a perforated grating drum, a feed hopper and a guarded V-belt drive. The build covers frame fabrication, drum assembly, drive sizing, wiring of the motor circuit and a throughput test against a stated target.",
  project_type: "Automated machine / food processing equipment",
  discipline: "Mechanical Engineering",
  difficulty: "Intermediate",
  parts: [
    {
      name: "1.5 HP single-phase electric motor",
      quantity: "1",
      notes: "1400 rpm; sized from the drum torque and target throughput.",
    },
    {
      name: "Mild steel angle iron, 40 x 40 x 5 mm",
      quantity: "3 lengths",
      notes: "Frame members; cut and welded to the drawing.",
    },
    {
      name: "Stainless steel sheet, 1.5 mm",
      quantity: "1 sheet",
      notes: "Hopper and food-contact surfaces.",
    },
    {
      name: "Grating drum shaft, 25 mm",
      quantity: "1",
      notes: "Turned to size, keyed for the pulley.",
    },
    {
      name: "Pillow block bearings",
      quantity: "2",
      notes: "P205 or equivalent, matched to the shaft diameter.",
    },
    {
      name: "V-belt and pulley set",
      quantity: "1 set",
      notes: "Ratio selected to bring drum speed into the working range.",
    },
    {
      name: "Electrical components",
      quantity: "1 set",
      notes: "Switch, cable, plug, and an enclosure for the connections.",
    },
    {
      name: "Consumables",
      quantity: "As required",
      notes: "Welding electrodes, cutting discs, fasteners, primer and paint.",
    },
  ],
  materials: [
    "Mild steel angle and flat bar",
    "Stainless steel sheet for food-contact parts",
    "Bearings and drive components",
    "Fasteners and consumables",
    "Paint and surface finish",
  ],
  estimated_material_cost: "₦95,000 – ₦130,000",
  estimated_engineering_cost: "₦30,000 – ₦45,000",
  estimated_workmanship: "₦55,000 – ₦75,000",
  estimated_total_cost: "₦180,000 – ₦250,000",
  estimated_timeline: "4 – 6 weeks",
  engineering_tasks: [
    "Requirement capture and throughput target",
    "Drive and torque calculations",
    "CAD modelling of frame, drum and hopper",
    "Structural check on the frame under operating load",
    "Fabrication drawings and cut list",
    "Welding and frame assembly",
    "Drum machining and shaft fitting",
    "Motor mounting, wiring and guarding",
    "Commissioning, throughput testing and iteration",
  ],
  tools_required: [
    "Arc welding machine",
    "Angle grinder and cutting discs",
    "Bench lathe",
    "Drill press",
    "Measuring and marking tools",
    "Multimeter",
    "CAD software (SolidWorks / Fusion)",
  ],
  risks: [
    "Steel and bearing prices move week to week, so material cost is the least stable line.",
    "Drum speed usually needs tuning after the first test run; a pulley change may be required.",
    "Food-contact surfaces must be stainless, which raises material cost against a plain mild-steel build.",
    "Machining availability can add days if the shaft has to be sent out.",
  ],
  assumptions: [
    "Single-phase 220 V mains is available at the test location.",
    "Throughput target assumed at roughly 100 kg/hr in the absence of a stated figure.",
    "Frame is bench-mounted rather than mobile; no castors or trolley included.",
    "Costs reflect current local market rates and exclude transport and installation.",
  ],
};

export const SAMPLE_NOTICE =
  "Sample breakdown — no analysis key is configured on this deployment, so this is illustrative example output rather than an analysis of your brief.";
