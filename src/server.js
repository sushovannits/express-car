import { app } from './app';
import chalk from 'chalk';

app.listen(app.get('port'), () => {
  console.log(`${chalk.green('✓')} App is listening at ${app.get('baseUrl')} in ${'env'} mode`);
  console.log('Press CTRL-C to stop\n');
})

export default app;