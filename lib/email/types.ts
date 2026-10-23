export type InlineEmailAttachment = {
  contentType: string
  filename: string
  contentId: string
  base64Content: string
}

export type EmailAsset = InlineEmailAttachment & { publicPath: string }

export type RenderedEmail = {
  html: string
  inlineAttachments: readonly InlineEmailAttachment[]
}

export type EmailContent = RenderedEmail & {
  subject: string
  text: string
}

export type EmailTitle = { line: string; prefix?: string; highlight: string }
export type EmailRow = { label: string; value: string }
