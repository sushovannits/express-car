import chalk from 'chalk';
import app from './app';
import { createLogger } from './handlers/utils';

const logger = createLogger();

app.listen(app.get('port'), () => {
  logger.info(`${chalk.green('✓')} App is listening at ${app.get('baseUrl')} in ${'env'} mode`);
  logger.info('Press CTRL-C to stop\n');
});

export default app;
