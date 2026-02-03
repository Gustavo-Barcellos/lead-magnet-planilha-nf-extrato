import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.info(`API listening on port ${PORT}`);
});
