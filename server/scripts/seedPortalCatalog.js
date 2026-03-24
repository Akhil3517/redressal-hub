import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Portal } from "../models/Portal.js";

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb://localhost:27017/ai_grievance_dashboard";

const portalsToSeed = [
  // Top municipal sanitation app (Municipal category)
  {
    categoryName: "Municipal",
    portalName: "Swachhata App / Swachhata-MoHUA",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://swachhata.mohua.gov.in",
    description:
      "Citizens can report sanitation issues like garbage piles, dirty streets, or public toilet maintenance directly to municipal authorities.",
    avgRating: 4.2,
    howToUse: [
      "Install the Swachhata mobile app or open the Swachhata-MoHUA portal.",
      "Allow location access for accurate complaint mapping.",
      "Click \"Register Complaint\".",
      "Select complaint type such as garbage, dirty street, or public toilet issue.",
      "Upload photo evidence and enter location details.",
      "Submit the complaint.",
      "Track the complaint status in the \"My Complaints\" section.",
    ],
    bestUsedFor: [
      "Garbage collection issues.",
      "Street and general sanitation complaints.",
      "Public toilet maintenance and cleanliness problems.",
    ],
  },
  // National-level grievance portals (Municipal category)
  {
    categoryName: "Municipal",
    portalName: "CPGRAMS",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://pgportal.gov.in",
    description: "Central government grievance portal for ministries and departments.",
    avgRating: 3.8,
    howToUse: [
      "Open the CPGRAMS portal.",
      "Click \"Lodge Public Grievance\".",
      "Create an account using your email or mobile number.",
      "Select the concerned Ministry or Department related to your complaint.",
      "Enter clear grievance details and upload supporting documents if needed.",
      "Submit the complaint and note the registration number.",
      "Track the status under the \"Track Grievance\" section.",
    ],
    bestUsedFor: [
      "Complaints against central government ministries and departments.",
      "Escalating issues when local or state grievance mechanisms have not resolved the problem.",
    ],
  },
  {
    categoryName: "Municipal",
    portalName: "UMANG App",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://umang.gov.in",
    description: "Unified mobile platform for many government services and grievances.",
    avgRating: 4.1,
    howToUse: [
      "Install the UMANG mobile app or open the UMANG website.",
      "Register using your mobile number and OTP.",
      "Search for the required service such as grievance, municipal services, or department-specific services.",
      "Choose the appropriate department or service.",
      "Submit your complaint or request with necessary details.",
      "Track status from the UMANG dashboard.",
    ],
    bestUsedFor: [
      "Accessing multiple government services from a single platform.",
      "Filing grievances when you prefer a mobile-first unified app experience.",
    ],
  },
  {
    categoryName: "Municipal",
    portalName: "MyGov India",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://www.mygov.in",
    description: "Citizen engagement platform with feedback and complaint features.",
    avgRating: 4.0,
  },
  // State-level grievance portals (Municipal category)
  {
    categoryName: "Municipal",
    portalName: "Aaple Sarkar Grievance Portal",
    level: "state",
    state: "Maharashtra",
    city: "",
    portalUrl: "https://grievances.maharashtra.gov.in",
    description: "State grievance portal for citizens of Maharashtra.",
    avgRating: 4.0,
    howToUse: [
      "Open the Aaple Sarkar grievance portal.",
      "Register using your mobile number or email ID.",
      "Select the relevant department for your grievance.",
      "Enter complaint details clearly and attach documents if necessary.",
      "Submit the complaint and note the generated complaint ID.",
      "Track the grievance status using the complaint ID.",
    ],
    bestUsedFor: [
      "Civic and public service grievances within Maharashtra.",
      "Escalating issues related to state government departments and services.",
    ],
  },
  {
    categoryName: "Municipal",
    portalName: "Jana Sunwai Samadhan Portal",
    level: "state",
    state: "Madhya Pradesh",
    city: "",
    portalUrl: "https://cmhelpline.mp.gov.in",
    description: "Chief Minister helpline and grievance redressal portal for Madhya Pradesh.",
    avgRating: 3.9,
    howToUse: [
      "Register on the Jana Sunwai Samadhan portal.",
      "Choose the appropriate complaint category.",
      "Fill in the grievance description with location and department details.",
      "Submit the complaint and note the complaint ID that is generated.",
      "Use the complaint ID to track resolution status on the portal.",
    ],
    bestUsedFor: [
      "State public service grievances in Madhya Pradesh.",
      "Issues that need escalation via the Chief Minister helpline framework.",
    ],
  },
  {
    categoryName: "Municipal",
    portalName: "Samadhan Portal Haryana",
    level: "state",
    state: "Haryana",
    city: "",
    portalUrl: "https://cmharyanacell.nic.in",
    description: "State grievance redressal portal for Haryana.",
    avgRating: 3.7,
  },
  {
    categoryName: "Municipal",
    portalName: "Lokvani Portal",
    level: "state",
    state: "Uttar Pradesh",
    city: "",
    portalUrl: "http://lokvani.up.nic.in",
    description: "Citizen services and grievance portal for Uttar Pradesh.",
    avgRating: 3.6,
  },
  {
    categoryName: "Municipal",
    portalName: "eSampark Portal Punjab",
    level: "state",
    state: "Punjab",
    city: "",
    portalUrl: "https://esampark.punjab.gov.in",
    description: "Citizen services and grievance portal for Punjab.",
    avgRating: 3.8,
  },
  {
    categoryName: "Municipal",
    portalName: "AP Grievance Redressal Portal",
    level: "state",
    state: "Andhra Pradesh",
    city: "",
    portalUrl: "https://gramawardsachivalayam.ap.gov.in",
    description: "State-level grievance redressal portal for Andhra Pradesh.",
    avgRating: 3.9,
  },
  // Local-level municipal portals (Municipal category)
  {
    categoryName: "Municipal",
    portalName: "GHMC Complaint Portal",
    level: "local",
    state: "Telangana",
    city: "Hyderabad",
    portalUrl: "https://ghmc.gov.in",
    description: "Municipal civic complaint portal for Hyderabad.",
    avgRating: 4.2,
    howToUse: [
      "Open the GHMC website.",
      "Navigate to \"Citizen Services\" and then \"Complaints\".",
      "Choose the relevant complaint category such as garbage, road damage, or street lights.",
      "Fill in the complaint form with address and description.",
      "Upload photos or supporting evidence if needed.",
      "Submit the complaint and note the reference ID.",
      "Track the complaint using the reference ID on the portal.",
    ],
    bestUsedFor: [
      "Hyderabad municipal issues including garbage, streets, and street lighting.",
      "Local civic complaints within Greater Hyderabad Municipal Corporation limits.",
    ],
  },
  {
    categoryName: "Municipal",
    portalName: "Greater Chennai Corporation Complaint Portal",
    level: "local",
    state: "Tamil Nadu",
    city: "Chennai",
    portalUrl: "https://chennaicorporation.gov.in",
    description: "Municipal complaint portal for Greater Chennai Corporation.",
    avgRating: 4.0,
  },
  {
    categoryName: "Municipal",
    portalName: "BBMP Sahaaya Portal",
    level: "local",
    state: "Karnataka",
    city: "Bengaluru",
    portalUrl: "https://sahaaya.bbmp.gov.in",
    description: "Grievance portal for Bruhat Bengaluru Mahanagara Palike (BBMP).",
    avgRating: 3.9,
  },
  {
    categoryName: "Municipal",
    portalName: "MCGM Complaint Portal",
    level: "local",
    state: "Maharashtra",
    city: "Mumbai",
    portalUrl: "https://portal.mcgm.gov.in",
    description: "Complaint portal for Municipal Corporation of Greater Mumbai.",
    avgRating: 4.1,
  },
  {
    categoryName: "Municipal",
    portalName: "NDMC Complaint Portal",
    level: "local",
    state: "Delhi",
    city: "New Delhi",
    portalUrl: "https://ndmc.gov.in",
    description: "Grievance portal for New Delhi Municipal Council.",
    avgRating: 4.0,
  },
  {
    categoryName: "Municipal",
    portalName: "Kolkata Municipal Corporation Portal",
    level: "local",
    state: "West Bengal",
    city: "Kolkata",
    portalUrl: "https://www.kmcgov.in",
    description: "Citizen services and complaints portal for Kolkata Municipal Corporation.",
    avgRating: 3.8,
  },
  // Electrical complaint portals (Electrical category)
  {
    categoryName: "Electrical",
    portalName: "National Consumer Helpline Electricity Complaints",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://consumerhelpline.gov.in",
    description:
      "Central consumer complaint system for reporting electricity billing disputes and service issues with power companies.",
    avgRating: 3.9,
    howToUse: [
      "Open the National Consumer Helpline website.",
      "Register using your mobile number or email ID.",
      "Select Electricity or Energy as the sector.",
      "Enter details of the electricity complaint including connection details.",
      "Upload bill copy or supporting proof if necessary.",
      "Submit the complaint.",
      "Track complaint status using the complaint ID.",
    ],
    bestUsedFor: [
      "Electricity billing disputes with power companies.",
      "General electricity service issues at the national consumer level.",
    ],
  },
  {
    categoryName: "Electrical",
    portalName: "Andhra Pradesh Electricity Consumer Services Portal",
    level: "state",
    state: "Andhra Pradesh",
    city: "",
    portalUrl: "https://www.apeasternpower.com",
    description: "Electricity complaint portal for Andhra Pradesh distribution companies.",
    avgRating: 4.0,
    howToUse: [
      "Open the Andhra Pradesh electricity consumer services website.",
      "Navigate to Consumer Services and choose Register Complaint.",
      "Enter your service number or consumer number.",
      "Select complaint type such as power failure, billing issue, or meter problem.",
      "Describe the issue in detail.",
      "Submit the complaint.",
      "Track the complaint using the reference ID.",
    ],
    bestUsedFor: [
      "Power outages and supply issues in Andhra Pradesh.",
      "Electricity billing disputes and meter-related complaints.",
    ],
  },
  {
    categoryName: "Electrical",
    portalName: "Telangana State Electricity Complaint Portal",
    level: "state",
    state: "Telangana",
    city: "",
    portalUrl: "https://tssouthernpower.com",
    description:
      "Portal for reporting power supply issues, meter problems, and billing complaints in Telangana.",
    avgRating: 4.1,
    howToUse: [
      "Open the Telangana electricity portal.",
      "Go to Customer Services and click Register Complaint.",
      "Enter your consumer number.",
      "Choose complaint category such as power outage, meter issue, or voltage problem.",
      "Provide a short description of the problem.",
      "Submit the complaint.",
      "Track complaint status online using the reference number.",
    ],
    bestUsedFor: [
      "Power outage and voltage fluctuation issues in Telangana.",
      "Meter-related problems and billing complaints for Telangana DISCOMs.",
    ],
  },
  {
    categoryName: "Electrical",
    portalName: "UP Power Corporation Complaint Portal",
    level: "state",
    state: "Uttar Pradesh",
    city: "",
    portalUrl: "https://uppcl.mpower.in",
    description: "Electricity complaint portal for consumers of Uttar Pradesh Power Corporation.",
    avgRating: 3.8,
    howToUse: [
      "Visit the UP Power Corporation complaint portal.",
      "Login or register using your mobile number.",
      "Enter your consumer or account number.",
      "Select the complaint type.",
      "Describe the issue and submit the complaint.",
      "Note the generated complaint reference number.",
      "Track complaint status on the portal using the reference number.",
    ],
    bestUsedFor: [
      "Electricity supply and billing complaints in Uttar Pradesh.",
      "Issues related to UPPCL connections and services.",
    ],
  },
  {
    categoryName: "Electrical",
    portalName: "BESCOM Electricity Complaint Portal",
    level: "local",
    state: "Karnataka",
    city: "Bangalore",
    portalUrl: "https://bescom.karnataka.gov.in",
    description:
      "Electricity complaint portal for Bangalore Electricity Supply Company (BESCOM) consumers.",
    avgRating: 4.2,
    howToUse: [
      "Visit the BESCOM website.",
      "Open the Customer Services section.",
      "Click on Register Complaint.",
      "Enter your consumer account ID.",
      "Select issue type such as power cut, transformer issue, or billing complaint.",
      "Submit the complaint.",
      "Track complaint status online using the complaint reference number.",
    ],
    bestUsedFor: [
      "Power cuts and transformer faults in BESCOM areas.",
      "Electricity billing and meter complaints in Bengaluru.",
    ],
  },
  {
    categoryName: "Electrical",
    portalName: "TANGEDCO Consumer Complaint Portal",
    level: "state",
    state: "Tamil Nadu",
    city: "",
    portalUrl: "https://www.tangedco.gov.in",
    description: "Electricity board portal for Tamil Nadu consumer complaints.",
    avgRating: 4.0,
    howToUse: [
      "Open the TANGEDCO portal.",
      "Login using your consumer number or registered credentials.",
      "Go to the Register Complaint section.",
      "Select the complaint category.",
      "Provide a description of the issue.",
      "Submit the complaint.",
      "Track status using the complaint number.",
    ],
    bestUsedFor: [
      "Electricity supply and billing issues in Tamil Nadu.",
      "Complaints related to TANGEDCO services and infrastructure.",
    ],
  },
  // Transport & Infrastructure (new category)
  {
    categoryName: "Transport & Infrastructure",
    portalName: "Parivahan Sewa Grievance Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://parivahan.gov.in",
    description:
      "Central transport services portal handling complaints related to vehicle registration, driving license services, and transport authorities.",
    avgRating: 4.0,
    howToUse: [
      "Open the Parivahan portal.",
      "Navigate to the Grievance or Feedback section.",
      "Register using your email or mobile number.",
      "Select the transport service type such as driving license, vehicle registration, or transport authority service.",
      "Enter detailed complaint information.",
      "Upload supporting documents if needed.",
      "Submit the complaint.",
      "Track status using the generated grievance ID.",
    ],
    bestUsedFor: [
      "Vehicle registration and RC-related grievances.",
      "Driving license service complaints.",
      "Issues with state or regional transport authorities using the Parivahan system.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "Delhi Transport Corporation Complaint Portal",
    level: "local",
    state: "Delhi",
    city: "Delhi",
    portalUrl: "https://dtc.delhi.gov.in",
    description:
      "Portal for complaints related to Delhi bus services, driver behaviour, delays, and service quality.",
    avgRating: 3.8,
    howToUse: [
      "Visit the Delhi Transport Corporation (DTC) website.",
      "Open the Public Grievance or Feedback section.",
      "Enter the complaint details, including bus route or bus number if available.",
      "Submit the complaint form.",
      "Note the complaint reference number.",
      "Track complaint status using the reference number on the portal if available.",
    ],
    bestUsedFor: [
      "Complaints about DTC bus service quality and delays.",
      "Issues with driver or conductor behaviour on Delhi buses.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "BMTC Complaint Portal",
    level: "local",
    state: "Karnataka",
    city: "Bengaluru",
    portalUrl: "https://mybmtc.karnataka.gov.in",
    description: "Complaint portal for Bengaluru Metropolitan Transport Corporation (BMTC) bus services.",
    avgRating: 4.0,
    howToUse: [
      "Open the BMTC website.",
      "Navigate to the Customer Feedback or Complaint section.",
      "Enter route number or bus details if relevant.",
      "Describe the issue clearly.",
      "Submit the complaint.",
      "Track status using the complaint ID if the portal provides tracking.",
    ],
    bestUsedFor: [
      "Complaints about BMTC bus punctuality and cleanliness.",
      "Issues with BMTC staff behaviour and route operations.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "Delhi Metro Rail Corporation Complaint Portal",
    level: "local",
    state: "Delhi",
    city: "Delhi",
    portalUrl: "https://www.delhimetrorail.com",
    description:
      "Portal for complaints related to Delhi Metro services, station facilities, ticketing, and security.",
    avgRating: 4.3,
    howToUse: [
      "Open the Delhi Metro Rail Corporation website.",
      "Navigate to the Contact Us or Feedback section.",
      "Select the appropriate complaint category.",
      "Enter details of the issue and provide station or train details if required.",
      "Submit the complaint.",
      "Track complaint status or wait for response via the contact details provided.",
    ],
    bestUsedFor: [
      "Issues with metro train operations and delays in Delhi.",
      "Complaints about station facilities, cleanliness, or ticketing at Delhi Metro.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "Hyderabad Metro Rail Complaint Portal",
    level: "local",
    state: "Telangana",
    city: "Hyderabad",
    portalUrl: "https://www.ltmetro.com",
    description: "Portal handling passenger complaints related to Hyderabad Metro rail services.",
    avgRating: 4.2,
    howToUse: [
      "Visit the Hyderabad Metro Rail (L&T Metro) website.",
      "Open the Contact or Feedback section.",
      "Enter passenger complaint details, including station or train information as needed.",
      "Submit the form with your contact details.",
      "Receive a complaint reference number if provided.",
      "Track or follow up on the response through customer service.",
    ],
    bestUsedFor: [
      "Service quality or delay complaints for Hyderabad Metro.",
      "Issues with station facilities, safety, or ticketing in Hyderabad Metro.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "NHAI Public Grievance Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://nhai.gov.in",
    description:
      "National Highways Authority of India portal for complaints related to national highways, toll roads, and highway infrastructure.",
    avgRating: 4.1,
    howToUse: [
      "Open the NHAI website.",
      "Navigate to the Public Grievance section.",
      "Register using your mobile number or email.",
      "Select complaint category such as road damage, toll issues, or highway maintenance.",
      "Enter location details and describe the issue.",
      "Submit the complaint.",
      "Track complaint status using the grievance ID, if available.",
    ],
    bestUsedFor: [
      "Road damage and maintenance issues on national highways.",
      "Toll-related disputes and complaints regarding highway infrastructure.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "MoRTH Grievance Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://morth.nic.in",
    description:
      "Ministry of Road Transport and Highways grievance portal for road infrastructure and transport services.",
    avgRating: 3.9,
    howToUse: [
      "Visit the Ministry of Road Transport and Highways (MoRTH) website.",
      "Go to the Grievance section.",
      "Login or register with your details.",
      "Choose the appropriate complaint category.",
      "Describe the issue clearly and submit the grievance.",
      "Track the complaint status on the portal.",
    ],
    bestUsedFor: [
      "Escalated complaints about national road infrastructure.",
      "Policy-level or ministry-level transport service grievances.",
    ],
  },
  {
    categoryName: "Transport & Infrastructure",
    portalName: "Hyderabad Traffic Police Complaint Portal",
    level: "local",
    state: "Telangana",
    city: "Hyderabad",
    portalUrl: "https://hyderabadtrafficpolice.gov.in",
    description:
      "Portal for traffic signal complaints, road safety issues, and reporting traffic rule violations in Hyderabad.",
    avgRating: 4.0,
    howToUse: [
      "Visit the Hyderabad Traffic Police website.",
      "Navigate to Citizen Services and select Lodge Complaint.",
      "Select complaint category such as traffic signal malfunction or road safety issue.",
      "Provide location details and describe the problem.",
      "Upload a photo if helpful.",
      "Submit the complaint.",
      "Track complaint status if tracking is provided on the portal.",
    ],
    bestUsedFor: [
      "Traffic signal malfunctions and dangerous junctions in Hyderabad.",
      "Road safety issues and traffic rule violation reports to Hyderabad Traffic Police.",
    ],
  },
  // Water Supply & Sanitation portals (new category)
  {
    categoryName: "Water Supply & Sanitation",
    portalName: "Jal Jeevan Mission",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://ejalshakti.gov.in",
    description:
      "National Ministry of Jal Shakti portal for issues related to rural drinking water schemes, infrastructure, and service interruptions.",
    avgRating: 4.0,
    howToUse: [
      "Visit the Jal Jeevan Mission portal.",
      "Navigate to the Public Grievance or Feedback section.",
      "Register using your mobile number or email.",
      "Select the concerned state and district.",
      "Choose the issue category, such as water supply or pipeline issue.",
      "Enter complaint details clearly.",
      "Submit the complaint and note the grievance ID for tracking.",
    ],
    bestUsedFor: [
      "No or irregular rural drinking water supply.",
      "Water quality concerns in Jal Jeevan Mission schemes.",
      "Pipeline or infrastructure issues in rural water projects.",
    ],
  },
  {
    categoryName: "Water Supply & Sanitation",
    portalName: "Swachhata App (Water & Sanitation)",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://swachhata.mohua.gov.in",
    description:
      "Swachhata platform focused on sanitation and cleanliness issues including sewage, drainage, and garbage near water bodies.",
    avgRating: 4.3,
    howToUse: [
      "Visit the Swachhata portal or open the Swachhata mobile app.",
      "Register using your mobile number.",
      "Select issue category such as drainage or sewage.",
      "Upload a photo of the problem location.",
      "Enter brief details and submit the complaint.",
      "Track resolution updates through the app or portal.",
    ],
    bestUsedFor: [
      "Sewage overflow and drainage blockages in urban areas.",
      "Garbage dumping near lakes, rivers, or other water bodies.",
      "Urban sanitation infrastructure complaints linked to water.",
    ],
  },
  {
    categoryName: "Water Supply & Sanitation",
    portalName: "Hyderabad Metropolitan Water Supply and Sewerage Board",
    level: "local",
    state: "Telangana",
    city: "Hyderabad",
    portalUrl: "https://www.hyderabadwater.gov.in",
    description:
      "Official portal for managing drinking water supply and sewerage services in Hyderabad city.",
    avgRating: 4.1,
    howToUse: [
      "Visit the HMWSSB (Hyderabad Metropolitan Water Supply and Sewerage Board) portal.",
      "Navigate to Customer Services and choose Lodge Complaint.",
      "Enter your consumer number or location details.",
      "Select the complaint category such as no water supply, pipe leakage, or sewer overflow.",
      "Describe the issue and submit the complaint.",
      "Track complaint status online through the portal.",
    ],
    bestUsedFor: [
      "No water supply or low pressure in Hyderabad.",
      "Water pipe leakage and sewer overflow complaints.",
      "Water tanker requests for HMWSSB service areas.",
    ],
  },
  {
    categoryName: "Water Supply & Sanitation",
    portalName: "Delhi Jal Board Complaint Portal",
    level: "local",
    state: "Delhi",
    city: "Delhi",
    portalUrl: "https://djb.gov.in",
    description:
      "Delhi Jal Board portal for water supply and sewage infrastructure complaints in the National Capital Territory of Delhi.",
    avgRating: 4.0,
    howToUse: [
      "Visit the Delhi Jal Board website.",
      "Go to Citizen Services and select Register Complaint.",
      "Enter your consumer ID or location details.",
      "Select the complaint type such as no water supply, contaminated water, or sewer blockage.",
      "Submit the complaint and note the reference number.",
      "Use the reference number to track complaint status on the portal.",
    ],
    bestUsedFor: [
      "No or irregular water supply in Delhi.",
      "Contaminated water and sewer blockage issues under Delhi Jal Board.",
      "Requests for water tanker services in DJB areas.",
    ],
  },
  // Health & Medical Services portals (new category)
  {
    categoryName: "Health & Medical Services",
    portalName: "Centralized Public Grievance Redress and Monitoring System (Health)",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://pgportal.gov.in",
    description:
      "Central government grievance portal used for complaints about Ministry of Health and Family Welfare and other health-related departments.",
    avgRating: 4.2,
    howToUse: [
      "Visit the PG Portal website.",
      "Click on Lodge Public Grievance.",
      "Register or login using your mobile number or email.",
      "Select the Ministry of Health and Family Welfare or the relevant health department.",
      "Enter detailed complaint information and upload documents if required.",
      "Submit the grievance and note the grievance number.",
      "Track the status using the grievance number on the portal.",
    ],
    bestUsedFor: [
      "Hospital negligence in government hospitals.",
      "Problems with central health schemes such as Ayushman Bharat.",
      "Poor hospital services and delays in treatment in central or state-run facilities.",
    ],
  },
  {
    categoryName: "Health & Medical Services",
    portalName: "Ayushman Bharat PM-JAY Grievance Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://pmjay.gov.in",
    description:
      "Grievance system for the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) health insurance scheme.",
    avgRating: 4.1,
    howToUse: [
      "Open the PM-JAY portal.",
      "Navigate to the Grievance or Support section.",
      "Login or register with your details.",
      "Enter the complaint related to Ayushman Bharat services.",
      "Provide hospital and beneficiary details where applicable.",
      "Submit the grievance and note the reference number.",
      "Track resolution status through the portal.",
    ],
    bestUsedFor: [
      "Hospitals refusing PM-JAY treatment.",
      "Scheme eligibility and claim rejection issues.",
      "Hospital billing complaints under Ayushman Bharat PM-JAY.",
    ],
  },
  {
    categoryName: "Health & Medical Services",
    portalName: "National Health Authority Grievance Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://nha.gov.in",
    description:
      "National Health Authority grievance portal for health schemes like Ayushman Bharat and related healthcare services.",
    avgRating: 4.0,
    howToUse: [
      "Visit the National Health Authority website.",
      "Navigate to the Public Grievances section.",
      "Register or login to the portal.",
      "Select the relevant complaint category.",
      "Enter hospital, scheme, and service details.",
      "Submit the complaint and track progress using the grievance reference.",
    ],
    bestUsedFor: [
      "Health insurance scheme-related issues under NHA-managed programs.",
      "Complaints about hospital services under Ayushman Bharat and similar schemes.",
      "Treatment denial under government-funded health schemes.",
    ],
  },
  {
    categoryName: "Health & Medical Services",
    portalName: "Central Drugs Standard Control Organization Complaint Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://cdsco.gov.in",
    description:
      "Regulatory authority portal for complaints about drug safety, medicine quality, and pharmaceutical regulation in India.",
    avgRating: 3.9,
    howToUse: [
      "Visit the CDSCO website.",
      "Go to the Public Complaint section.",
      "Select the complaint type related to drug safety or quality.",
      "Provide details of the medicine, batch, and pharmacy or manufacturer.",
      "Upload evidence such as photos, prescriptions, or bills if available.",
      "Submit the complaint and receive acknowledgement.",
    ],
    bestUsedFor: [
      "Fake or substandard medicines and suspected counterfeit drugs.",
      "Serious medicine side effects and safety issues.",
      "Pharmacy or manufacturer violations of drug regulations.",
    ],
  },
  {
    categoryName: "Health & Medical Services",
    portalName: "108 Emergency Ambulance Service Complaints",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://www.emri.in",
    description:
      "Grievance and feedback portal for the 108 emergency ambulance service operated by EMRI in multiple Indian states.",
    avgRating: 4.3,
    howToUse: [
      "Call 108 in case of a medical emergency to request an ambulance.",
      "For complaints or feedback, visit the EMRI website.",
      "Open the contact or grievance form section.",
      "Provide details of the incident, location, and response received.",
      "Submit the complaint and await follow-up from the service team.",
    ],
    bestUsedFor: [
      "Complaints about ambulance response time or delays.",
      "Concerns about emergency service quality during 108 calls.",
      "Feedback on paramedic behaviour or ambulance facilities.",
    ],
  },
  // Education portals (new category)
  {
    categoryName: "Education",
    portalName: "Centralized Public Grievance Redress and Monitoring System (Education)",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://pgportal.gov.in",
    description:
      "Central government grievance platform where citizens can file complaints against the Ministry of Education and other education-related departments.",
    avgRating: 4.2,
    howToUse: [
      "Visit the PG Portal website.",
      "Click on Lodge Public Grievance.",
      "Register using your mobile number or email, or login if you already have an account.",
      "Select the Ministry of Education or the relevant education department as the grievance addressee.",
      "Enter detailed complaint information and upload documents if needed.",
      "Submit the grievance and note the reference number.",
      "Track the grievance status on the portal using the reference number.",
    ],
    bestUsedFor: [
      "School and university infrastructure issues under government bodies.",
      "Complaints about university administration and delays in education services.",
      "Problems with government education schemes or policies.",
    ],
  },
  {
    categoryName: "Education",
    portalName: "National Scholarship Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://scholarships.gov.in",
    description:
      "Government platform for managing student scholarships and resolving issues related to scholarship applications, payments, and verification.",
    avgRating: 4.1,
    howToUse: [
      "Visit the National Scholarship Portal.",
      "Login using your student credentials or register if you are a new user.",
      "Navigate to the Helpdesk or Grievance section.",
      "Submit the complaint with scholarship details, including application ID and scheme name.",
      "Provide student and institution details as requested.",
      "Track the grievance status online through the portal.",
    ],
    bestUsedFor: [
      "Scholarship application errors and technical issues.",
      "Delays in scholarship payment or non-receipt of funds.",
      "Verification and eligibility disputes for scholarship schemes.",
    ],
  },
  {
    categoryName: "Education",
    portalName: "University Grants Commission e-Samadhan Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://samadhaan.ugc.ac.in",
    description:
      "UGC e-Samadhan portal for resolving grievances of university students, faculty, and staff across higher-education institutions.",
    avgRating: 4.3,
    howToUse: [
      "Open the UGC e-Samadhan website.",
      "Register or login as a student, faculty member, or other stakeholder.",
      "Select the appropriate grievance category.",
      "Enter university details and describe the complaint.",
      "Upload supporting documents such as fee receipts or notices if required.",
      "Submit the grievance and track status through the portal dashboard.",
    ],
    bestUsedFor: [
      "University grievance complaints related to administration or academics.",
      "Admission issues and fee disputes in UGC-recognised institutions.",
      "Academic service and examination-related problems.",
    ],
  },
  {
    categoryName: "Education",
    portalName: "Central Board of Secondary Education Complaint Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://cbse.gov.in",
    description:
      "CBSE portal for complaints related to CBSE-affiliated schools, examinations, and academic services.",
    avgRating: 4.0,
    howToUse: [
      "Visit the CBSE website.",
      "Navigate to the Public Grievance or Contact section.",
      "Select the complaint category relevant to exams, results, or school administration.",
      "Enter detailed information about the issue.",
      "Submit the complaint form.",
      "Track the status through the grievance system if tracking is available.",
    ],
    bestUsedFor: [
      "Exam result issues and errors in CBSE marksheets.",
      "Complaints about CBSE school administration and student treatment.",
      "Certificate or academic document correction issues.",
    ],
  },
  {
    categoryName: "Education",
    portalName: "All India Council for Technical Education Complaint Portal",
    level: "national",
    state: "",
    city: "",
    portalUrl: "https://www.aicte-india.org",
    description:
      "AICTE grievance portal for technical education complaints related to engineering, management, and other AICTE-approved institutions.",
    avgRating: 4.0,
    howToUse: [
      "Visit the AICTE website.",
      "Navigate to the Grievance Redressal section.",
      "Register or login with your details.",
      "Enter complaint information along with the institution name and program.",
      "Upload evidence such as fee receipts, notices, or communication records if required.",
      "Submit the grievance and track resolution via the portal.",
    ],
    bestUsedFor: [
      "College infrastructure and facilities issues in AICTE-approved institutes.",
      "Fee disputes and refund complaints for technical courses.",
      "Academic administration and compliance problems in technical education.",
    ],
  },
];

async function ensureCategories() {
  const definitions = [
    {
      name: "Municipal",
      description: "Municipal and civic grievance portals",
    },
    {
      name: "Electrical",
      description:
        "Portals for electricity complaints such as power outages, transformer faults, street light issues, and billing disputes.",
    },
    {
      name: "Transport & Infrastructure",
      description:
        "Grievance portals for transport services, public transport, metro rail, and road or highway infrastructure issues.",
    },
    {
      name: "Water Supply & Sanitation",
      description:
        "Portals for complaints about water supply, drinking water quality, sewerage, and sanitation linked to water infrastructure.",
    },
    {
      name: "Health & Medical Services",
      description:
        "Grievance portals for health schemes, hospital services, medicines, and emergency medical response.",
    },
    {
      name: "Education",
      description:
        "Grievance portals for schools, universities, scholarships, and technical education institutions.",
    },
  ];

  const map = {};
  for (const def of definitions) {
    let cat = await Category.findOne({ name: def.name });
    if (!cat) {
      cat = await Category.create(def);
    }
    map[def.name] = cat;
  }
  return map;
}

async function seedPortals() {
  process.env.MONGO_URI ||= DEFAULT_MONGO_URI;
  await connectDB();

  const categories = await ensureCategories();

  for (const def of portalsToSeed) {
    const existing = await Portal.findOne({ portalName: def.portalName });
    const categoryDoc = categories[def.categoryName || "Municipal"];

    if (existing) {
      // Only update metadata; keep existing review stats if already present.
      const updates = {
        category: categoryDoc?._id ?? existing.category,
        level: def.level,
        state: def.state,
        city: def.city,
        portalUrl: def.portalUrl,
        description: def.description,
      };

      if (existing.totalReviews === 0) {
        updates.avgRating = def.avgRating;
      }

      if (def.howToUse) {
        updates.howToUse = def.howToUse;
      }
      if (def.bestUsedFor) {
        updates.bestUsedFor = def.bestUsedFor;
      }

      await Portal.updateOne({ _id: existing._id }, updates);
      // eslint-disable-next-line no-console
      console.log(`Updated portal: ${def.portalName}`);
    } else {
      await Portal.create({
        category: categoryDoc?._id,
        level: def.level,
        state: def.state,
        city: def.city,
        portalName: def.portalName,
        portalUrl: def.portalUrl,
        description: def.description,
        avgRating: def.avgRating,
        totalReviews: 0,
        howToUse: def.howToUse || [],
        bestUsedFor: def.bestUsedFor || [],
      });
      // eslint-disable-next-line no-console
      console.log(`Created portal: ${def.portalName}`);
    }
  }

  // eslint-disable-next-line no-console
  console.log("Portal catalog seeding complete");
  process.exit(0);
}

seedPortals().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to seed portals:", err);
  process.exit(1);
});

