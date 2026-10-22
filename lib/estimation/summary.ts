import type { EstimationCopy } from "./copy"
import { isApplication, type EstimateAnswers } from "./schema"

export function estimateSummary(answers: EstimateAnswers, copy: EstimationCopy, full = false) {
  const { types, sector, audience, features, design, delay, budget } = answers
  const featureLabels = features.map(feature => {
    if (feature === "ai" && answers.featureIA) return copy.features.ai + " : " + answers.featureIA
    if (feature === "other" && answers.featureOther) return copy.features.other + " : " + answers.featureOther
    return copy.features[feature]
  })
  return [
    [types.map(type => copy.types[type].title).join(", "), answers.typeOther].filter(Boolean).join(" — "),
    [sector ? copy.sectors[sector] : "", answers.sectorNote].filter(Boolean).join(" — "),
    [isApplication(types) && audience ? copy.audiences[audience] : "", ...featureLabels].filter(Boolean).join(", "),
    design ? copy.designs[design].title : "",
    [delay ? copy.delays[delay] : "", answers.deadline ? copy.status.deadline + answers.deadline : "", budget ? copy.budgets[budget] : "", ...answers.constraints.map(value => copy.constraints[value])].filter(Boolean).join(", "),
    full ? [answers.name, answers.desc, answers.link].filter(Boolean).join("\n\n") : [answers.name, answers.link].filter(Boolean).join(" · ") || (answers.desc ? copy.status.descriptionProvided : ""),
  ].map((value, index) => ({ label: copy.steps[index].label, value, step: index + 1 }))
}

export function estimateEmailBody(answers: EstimateAnswers, copy: EstimationCopy) {
  const details = ["firstName", "email", "company", "phone"] as const
  return [
    ...details.map(field => copy.fields[field] + " : " + (answers[field] || "—")),
    "",
    ...estimateSummary(answers, copy, true).map(row => row.label + "\n" + (row.value || copy.status.unspecified) + "\n"),
  ].join("\n")
}
