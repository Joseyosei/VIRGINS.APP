import { Filter } from 'bad-words';

const filter = new Filter();

export interface ModerationResult {
  clean: string;
  flagged: boolean;
  reason?: string;
}

/**
 * Filter a text message for profanity.
 * Returns the cleaned text and a flag indicating if it was flagged.
 */
export const filterMessage = (text: string): ModerationResult => {
  try {
    if (filter.isProfane(text)) {
      return {
        clean: filter.clean(text),
        flagged: true,
        reason: 'Message contains inappropriate language',
      };
    }
    return { clean: text, flagged: false };
  } catch {
    // If the filter throws (e.g., on edge cases), pass through
    return { clean: text, flagged: false };
  }
};

/**
 * Check if an image buffer should be flagged for moderation.
 * Uses AWS Rekognition if configured, otherwise stubs to false (allow-all).
 */
export const shouldFlagImage = async (buffer: Buffer): Promise<boolean> => {
  const region = process.env.AWS_REKOGNITION_REGION || process.env.AWS_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const enabled = process.env.ENABLE_CONTENT_MODERATION === 'true';

  if (!enabled || !region || !accessKey || accessKey.startsWith('replace')) {
    return false; // Stub — allow all images when unconfigured
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rekognition = await (Function('return import')('@aws-sdk/client-rekognition') as Promise<any>);
    const client = new rekognition.RekognitionClient({ region });
    const command = new rekognition.DetectModerationLabelsCommand({
      Image: { Bytes: buffer },
      MinConfidence: 70,
    });
    const response = await client.send(command);
    return (response.ModerationLabels?.length ?? 0) > 0;
  } catch (err) {
    console.error('[Moderation] Rekognition error (package may not be installed):', err);
    return false; // Fail open — allow on error
  }
};
