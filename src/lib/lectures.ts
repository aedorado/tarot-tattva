import fs from 'fs';
import path from 'path';

export interface Lecture {
  id: string;
  title: string;
  filename: string;
  content: string;
}

export function getAllLectures(): Lecture[] {
  try {
    const notesDir = path.join(process.cwd(), 'notes');
    if (!fs.existsSync(notesDir)) return [];

    const files = fs.readdirSync(notesDir).filter((f) => f.endsWith('.md'));
    const lectures: Lecture[] = [];

    for (const file of files) {
      const filePath = path.join(notesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract title from first line (# Title)
      const firstLine = content.split('\n')[0] || '';
      const title = firstLine.replace(/^#\s*/, '').trim() || file.replace(/\.md$/, '');

      lectures.push({
        id: file.replace(/\.md$/, ''),
        title,
        filename: file,
        content
      });
    }

    return lectures.sort((a, b) => a.id.localeCompare(b.id));
  } catch (err) {
    console.error('Error reading lectures:', err);
    return [];
  }
}
