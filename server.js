import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import sequelize from './config/database.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import vacationRoutes from './routes/vacation.routes.js';
import exitAuthorisationRoutes from './routes/exitAuthorisation.routes.js';
import morningDelayRoues from './routes/morningDelay.routes.js';
import cinRoutes from './routes/cin.routes.js';
import memberRoutes from './routes/member.routes.js';
import reportRoutes from './routes/report.routes.js';
import evaluationReportRoutes from './routes/evaluation-report.routes.js';
import releasetRoutes from './routes/release.routes.js';
import healthAssuranceRoutes from './routes/health-assurance.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';






const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();



// Middlewares
app.use(cors());
//app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Serve static files
// To resolve '__dirname' in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
//app.use('/uploads', express.static('uploads'));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Sync the database
sequelize.sync()
 .then(() => {
  console.log('Database synced successfully.');
 })
 .catch((err) => {
  console.error('Failed to sync database:', err);
 });

// Default route to check if server is running
app.get('/', (req, res) => {
 res.send('Server is running!');
});


// Use the user routes
app.use('/api', userRoutes);
app.use('/api', vacationRoutes);
app.use('/api', exitAuthorisationRoutes);
app.use('/api', morningDelayRoues);
app.use('/api/', cinRoutes);
app.use('/api/', memberRoutes);
app.use('/api/', reportRoutes);
app.use('/api/', evaluationReportRoutes);
app.use('/api/', releasetRoutes);
app.use('/api/', healthAssuranceRoutes);










// Start the server
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});
