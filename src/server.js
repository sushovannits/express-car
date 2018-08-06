import chalk from 'chalk';
import Lamlog from 'lamlog';
import app from './app';

const logger = new Lamlog({
  name: 'app',
  level: process.env.NODE_ENV === 'dev'
    ? 'debug'
    : 'error',
});

app.listen(app.get('port'), () => {
  logger.info(`${chalk.green('✓')} App is listening at ${app.get('baseUrl')} in ${'env'} mode`);
  logger.info('Press CTRL-C to stop\n');
});

export default app;
