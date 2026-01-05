import { AuthRepositoryApi } from '../repositories/AuthRepositoryApi';
import { AlertRepositoryApi } from '../repositories/AlertRepositoryApi';
import { ClientRepositoryApi } from '../repositories/ClientRepositoryApi';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '../../application/use-cases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/GetCurrentUserUseCase';
import { GetCsrfTokenUseCase } from '../../application/use-cases/auth/GetCsrfTokenUseCase';
import { SendAlertUseCase } from '../../application/use-cases/alerts/SendAlertUseCase';
import { GetNotificationsUseCase } from '../../application/use-cases/alerts/GetNotificationsUseCase';
import { GetNearbyAlertsUseCase } from '../../application/use-cases/alerts/GetNearbyAlertsUseCase';
import { UpdateAlertLocationUseCase } from '../../application/use-cases/alerts/UpdateAlertLocationUseCase';
import { UpdateAlertStatusUseCase } from '../../application/use-cases/alerts/UpdateAlertStatusUseCase';
import { GetAlertHistoryUseCase } from '../../application/use-cases/alerts/GetAlertHistoryUseCase';
import { StopEmergencyUseCase } from '../../application/use-cases/alerts/StopEmergencyUseCase';
import { DeviceBehaviorService } from '../services/deviceBehavior.service';
import { OfflineAlertService } from '../services/offlineAlert.service';
import { LocationService } from '../services/location.service';
import { SocketService } from '../services/SocketService';
import { StartLocationSyncUseCase } from '../../application/use-cases/location/StartLocationSyncUseCase';
import { StopLocationSyncUseCase } from '../../application/use-cases/location/StopLocationSyncUseCase'; // Imported
import { GetCurrentLocationUseCase } from '../../application/use-cases/location/GetCurrentLocationUseCase';
import { RenameLocationUseCase } from '../../application/use-cases/location/RenameLocationUseCase';
import { PreferencesService } from '../services/preferences.service'; // Imported
import { DeviceStatusService } from '../services/deviceStatus.service'; // Imported

import { GetClientProfileUseCase } from '../../application/use-cases/client/GetClientProfileUseCase';
import { UpdateClientProfileUseCase } from '../../application/use-cases/client/UpdateClientProfileUseCase';
import { UploadProfileImageUseCase } from '../../application/use-cases/client/UploadProfileImageUseCase';
import { ManageClientPhonesUseCase } from '../../application/use-cases/client/ManageClientPhonesUseCase';
import { GetDashboardStatsUseCase } from '../../application/use-cases/client/GetDashboardStatsUseCase';

import { GroupRepositoryApi } from '../repositories/GroupRepositoryApi';
import { GetGroupsUseCase } from '../../application/use-cases/groups/GetGroupsUseCase';
import { CreateGroupUseCase } from '../../application/use-cases/groups/CreateGroupUseCase';
import { JoinGroupUseCase } from '../../application/use-cases/groups/JoinGroupUseCase';
import { LeaveGroupUseCase } from '../../application/use-cases/groups/LeaveGroupUseCase';
import { GetGroupDetailsUseCase } from '../../application/use-cases/groups/GetGroupDetailsUseCase';
import { GetGroupMembersUseCase } from '../../application/use-cases/groups/GetGroupMembersUseCase';
import { UploadGroupImageUseCase } from '../../application/use-cases/groups/UploadGroupImageUseCase';
import { GetGroupMessagesUseCase } from '../../application/use-cases/groups/GetGroupMessagesUseCase';
import { SendGroupMessageUseCase } from '../../application/use-cases/groups/SendGroupMessageUseCase';

import { ContactRepositoryApi } from '../repositories/ContactRepositoryApi';
import { GetContactsUseCase } from '../../application/use-cases/contacts/GetContactsUseCase';
import { AddContactUseCase } from '../../application/use-cases/contacts/AddContactUseCase';
import { UpdateContactUseCase } from '../../application/use-cases/contacts/UpdateContactUseCase';
import { DeleteContactUseCase } from '../../application/use-cases/contacts/DeleteContactUseCase';
import { GetPendingRequestsUseCase } from '../../application/use-cases/contacts/GetPendingRequestsUseCase';
import { RespondToContactRequestUseCase } from '../../application/use-cases/contacts/RespondToContactRequestUseCase';
import { SendContactRequestUseCase } from '../../application/use-cases/contacts/SendContactRequestUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';

// Casos de Uso - Preferencias
import { GetAutoLoginSettingUseCase } from '../../application/use-cases/preferences/GetAutoLoginSettingUseCase';
import { ToggleAutoLoginSettingUseCase } from '../../application/use-cases/preferences/ToggleAutoLoginSettingUseCase';

// Casos de Uso - Cliente (adicionales)
import { GetProfileImageUrlUseCase } from '../../application/use-cases/client/GetProfileImageUrlUseCase';

// Repositories & Services
const authRepository = new AuthRepositoryApi();
const alertRepository = new AlertRepositoryApi();
const clientRepository = new ClientRepositoryApi();
const groupRepository = new GroupRepositoryApi();
const contactRepository = new ContactRepositoryApi();
const contentRepository = new ContentRepositoryApi();
const locationRepository = new LocationRepositoryApi();
const locationService = new LocationService();
const preferencesService = new PreferencesService(); // Instantiated
const deviceStatusService = new DeviceStatusService(); // Instantiated

// Use Cases
const loginUseCase = new LoginUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
const getCsrfTokenUseCase = new GetCsrfTokenUseCase(authRepository);

const sendAlertUseCase = new SendAlertUseCase(alertRepository, new DeviceBehaviorService());
const stopEmergencyUseCase = new StopEmergencyUseCase(alertRepository, new DeviceBehaviorService());
const getNotificationsUseCase = new GetNotificationsUseCase(alertRepository);
const getNearbyAlertsUseCase = new GetNearbyAlertsUseCase(alertRepository);
const updateAlertLocationUseCase = new UpdateAlertLocationUseCase(alertRepository);
const updateAlertStatusUseCase = new UpdateAlertStatusUseCase(alertRepository);

const startLocationSyncUseCase = new StartLocationSyncUseCase(locationService);
const getCurrentLocationUseCase = new GetCurrentLocationUseCase(locationService);

const getClientProfileUseCase = new GetClientProfileUseCase(clientRepository);
const updateClientProfileUseCase = new UpdateClientProfileUseCase(clientRepository);
const uploadProfileImageUseCase = new UploadProfileImageUseCase(clientRepository);
const manageClientPhonesUseCase = new ManageClientPhonesUseCase(clientRepository);
const getAppContentUseCase = new GetAppContentUseCase(contentRepository);
const getSavedLocationsUseCase = new GetSavedLocationsUseCase(locationRepository);
const saveLocationUseCase = new SaveLocationUseCase(locationRepository);
const deleteLocationUseCase = new DeleteLocationUseCase(locationRepository);

export const container = {
  authRepository,
  alertRepository,
  clientRepository,
  groupRepository,
  contactRepository,
  locationService,
  liveTrackingService: new SocketService(),
  deviceService: new DeviceBehaviorService(),
  offlineAlertService: new OfflineAlertService(),

  loginUseCase,
  logoutUseCase,
  getCurrentUserUseCase,
  getCsrfTokenUseCase,

  sendAlertUseCase,
  stopEmergencyUseCase,
  getNotificationsUseCase,
  getNearbyAlertsUseCase,
  updateAlertLocationUseCase,
  updateAlertStatusUseCase,
  getAlertHistoryUseCase: new GetAlertHistoryUseCase(alertRepository),

  startLocationSyncUseCase,
  getCurrentLocationUseCase,

  getClientProfileUseCase,
  updateClientProfileUseCase,
  uploadProfileImageUseCase,
  manageClientPhonesUseCase,

  // Use Cases - Groups
  getGroupsUseCase: new GetGroupsUseCase(groupRepository),
  createGroupUseCase: new CreateGroupUseCase(groupRepository),
  joinGroupUseCase: new JoinGroupUseCase(groupRepository),
  leaveGroupUseCase: new LeaveGroupUseCase(groupRepository),
  getGroupDetailsUseCase: new GetGroupDetailsUseCase(groupRepository),
  getGroupMembersUseCase: new GetGroupMembersUseCase(groupRepository),
  uploadGroupImageUseCase: new UploadGroupImageUseCase(groupRepository),
  getGroupMessagesUseCase: new GetGroupMessagesUseCase(groupRepository),
  sendGroupMessageUseCase: new SendGroupMessageUseCase(groupRepository),

  // Use Cases - Contacts
  getContactsUseCase: new GetContactsUseCase(contactRepository),
  addContactUseCase: new AddContactUseCase(contactRepository),
  updateContactUseCase: new UpdateContactUseCase(contactRepository),
  deleteContactUseCase: new DeleteContactUseCase(contactRepository),
  getPendingRequestsUseCase: new GetPendingRequestsUseCase(contactRepository),
  respondToContactRequestUseCase: new RespondToContactRequestUseCase(contactRepository),
  sendContactRequestUseCase: new SendContactRequestUseCase(contactRepository),
  registerUseCase: new RegisterUseCase(authRepository)
};
