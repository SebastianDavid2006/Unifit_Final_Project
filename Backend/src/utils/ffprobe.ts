import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      filePath
    ], { timeout: 10000 });

    const duration = parseFloat(stdout.trim());
    if (isNaN(duration)) throw new Error('Duración inválida');
    return duration;
  } catch (err) {
    throw new Error(`Error obteniendo duración del video: ${err instanceof Error ? err.message : String(err)}`);
  }
}