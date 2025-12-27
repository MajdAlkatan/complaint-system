import { Building2, CheckCircle2, FileText, Flag, User } from "lucide-react";

export const departments = [
  {
    name: "Public Works",
    percentage: 86,
    resolved: 754,
    total: 876,
    color: "bg-green-500",
  },
  {
    name: "Sanitation",
    percentage: 90,
    resolved: 586,
    total: 654,
    color: "bg-green-500",
  },
  {
    name: "Public Health",
    percentage: 85,
    resolved: 367,
    total: 432,
    color: "bg-green-500",
  },
  {
    name: "Transportation",
    percentage: 85,
    resolved: 196,
    total: 234,
    color: "bg-green-500",
  },
  {
    name: "Parks & Recreation",
    percentage: 91,
    resolved: 136,
    total: 149,
    color: "bg-green-500",
  },
];

export const activities = [
  {
    action: "New complaint filed",
    user: "by John Citizen",
    time: "5 minutes ago",
    icon: FileText,
    iconColor: "text-gray-400",
  },
  {
    action: "Complaint resolved",
    user: "by Sarah Employee",
    time: "12 minutes ago",
    icon: CheckCircle2,
    iconColor: "text-green-500",
  },
  {
    action: "New employee added",
    user: "by Admin User",
    time: "1 hour ago",
    icon: User,
    iconColor: "text-blue-500",
  },
  {
    action: "Department created",
    user: "by Admin User",
    time: "2 hours ago",
    icon: Building2,
    iconColor: "text-purple-500",
  },
  {
    action: "Complaint escalated",
    user: "by Mike Employee",
    time: "3 hours ago",
    icon: Flag,
    iconColor: "text-orange-500",
  },
];
