import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  Phone,
  ExternalLink,
  Calendar,
  Leaf,
  Droplets,
  Recycle,
  TreePine,
  Star,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Trophy,
  Target,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface CommunityDrive {
  id: string;
  title: string;
  type: "plantation" | "cleanup" | "river-cleaning" | "awareness";
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  organizer: string;
  contact: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "completed";
  points: number;
  requirements: string[];
  image?: string;
  distance: number; // in km
}

const CommunityDrives = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // User analytics data
  const userAnalytics = {
    totalDrivesAttended: 8,
    totalHoursVolunteered: 32,
    totalPointsEarned: 640,
    drivesThisMonth: 3,
    favoriteDriveType: "Plantation",
    totalParticipants: 156,
    rank: 12,
  };

  const drives: CommunityDrive[] = [
    {
      id: "1",
      title: "Riverside Cleanup Drive",
      type: "river-cleaning",
      description:
        "Join us for a comprehensive cleanup of the Yamuna River banks. We'll be removing plastic waste, debris, and conducting water quality testing.",
      location: "Yamuna River Bank, Delhi",
      date: "2024-01-15",
      time: "08:00 AM",
      duration: "4 hours",
      organizer: "Green Earth Foundation",
      contact: "+91 98765 43210",
      maxParticipants: 50,
      currentParticipants: 32,
      status: "upcoming",
      points: 100,
      requirements: ["Safety gloves", "Water bottle", "Comfortable clothes"],
      distance: 2.5,
    },
    {
      id: "2",
      title: "Urban Forest Plantation",
      type: "plantation",
      description:
        "Help us plant 500 native trees in the city's new urban forest project. Learn about native species and their environmental benefits.",
      location: "Lodhi Garden, New Delhi",
      date: "2024-01-20",
      time: "07:00 AM",
      duration: "6 hours",
      organizer: "Delhi Forest Department",
      contact: "+91 98765 43211",
      maxParticipants: 100,
      currentParticipants: 78,
      status: "upcoming",
      points: 150,
      requirements: ["Shovel", "Water bottle", "Hat", "Sun protection"],
      distance: 5.2,
    },
    {
      id: "3",
      title: "Beach Cleanup Campaign",
      type: "cleanup",
      description:
        "Marine life protection drive at Juhu Beach. We'll collect plastic waste and educate visitors about ocean conservation.",
      location: "Juhu Beach, Mumbai",
      date: "2024-01-12",
      time: "06:30 AM",
      duration: "3 hours",
      organizer: "Ocean Warriors Mumbai",
      contact: "+91 98765 43212",
      maxParticipants: 80,
      currentParticipants: 45,
      status: "ongoing",
      points: 80,
      requirements: ["Beach cleanup kit", "Sunscreen", "Reusable water bottle"],
      distance: 8.7,
    },
    {
      id: "4",
      title: "Climate Action Awareness Walk",
      type: "awareness",
      description:
        "Join our awareness walk through the city center to educate people about climate change and sustainable living practices.",
      location: "Connaught Place, New Delhi",
      date: "2024-01-18",
      time: "05:00 PM",
      duration: "2 hours",
      organizer: "Climate Action Delhi",
      contact: "+91 98765 43213",
      maxParticipants: 200,
      currentParticipants: 156,
      status: "upcoming",
      points: 60,
      requirements: ["Comfortable walking shoes", "Awareness materials"],
      distance: 1.8,
    },
    {
      id: "5",
      title: "Wetland Restoration Project",
      type: "plantation",
      description:
        "Help restore the local wetland ecosystem by planting native aquatic plants and removing invasive species.",
      location: "Okhla Bird Sanctuary, Delhi",
      date: "2024-01-25",
      time: "08:30 AM",
      duration: "5 hours",
      organizer: "Wetland Conservation Society",
      contact: "+91 98765 43214",
      maxParticipants: 40,
      currentParticipants: 28,
      status: "upcoming",
      points: 120,
      requirements: ["Wading boots", "Waterproof gloves", "Change of clothes"],
      distance: 12.3,
    },
    {
      id: "6",
      title: "Community Garden Setup",
      type: "plantation",
      description:
        "Establish a community garden in your neighborhood. Learn organic farming techniques and sustainable gardening practices.",
      location: "Sector 15, Noida",
      date: "2024-01-10",
      time: "09:00 AM",
      duration: "4 hours",
      organizer: "Urban Farmers Collective",
      contact: "+91 98765 43215",
      maxParticipants: 30,
      currentParticipants: 30,
      status: "completed",
      points: 90,
      requirements: ["Gardening tools", "Seeds", "Compost"],
      distance: 6.1,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "plantation":
        return <TreePine className="h-5 w-5 text-green-600" />;
      case "cleanup":
        return <Recycle className="h-5 w-5 text-blue-600" />;
      case "river-cleaning":
        return <Droplets className="h-5 w-5 text-cyan-600" />;
      case "awareness":
        return <Leaf className="h-5 w-5 text-emerald-600" />;
      default:
        return <Leaf className="h-5 w-5 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "plantation":
        return "Plantation Drive";
      case "cleanup":
        return "Cleanup Drive";
      case "river-cleaning":
        return "River Cleaning";
      case "awareness":
        return "Awareness Campaign";
      default:
        return "Community Drive";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || drive.type === filterType;
    const matchesStatus =
      filterStatus === "all" || drive.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleJoinDrive = (driveId: string) => {
    // In a real app, this would make an API call
    console.log(`Joining drive: ${driveId}`);
    // You could show a success message or redirect to a registration form
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient-eco mb-2">
          Community Drives
        </h1>
        <p className="text-muted-foreground">
          Join hands with your community to make a real environmental impact!
        </p>
      </div>

      {/* Analytics Section */}
      <Card className="card-eco mb-6">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Community Impact</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Drives Attended */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gradient-eco">
                {userAnalytics.totalDrivesAttended}
              </div>
              <div className="text-sm text-muted-foreground">
                Drives Attended
              </div>
            </div>

            {/* Total Hours Volunteered */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary-glow/10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-accent to-primary-glow flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gradient-water">
                {userAnalytics.totalHoursVolunteered}
              </div>
              <div className="text-sm text-muted-foreground">
                Hours Volunteered
              </div>
            </div>

            {/* Total Points Earned */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-warning/10 to-primary/10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-warning to-primary flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gradient-accent">
                {userAnalytics.totalPointsEarned}
              </div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>

            {/* Current Rank */}
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary-glow/10 to-accent/10">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary-glow to-accent flex items-center justify-center mx-auto mb-2">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gradient-eco">
                #{userAnalytics.rank}
              </div>
              <div className="text-sm text-muted-foreground">
                Community Rank
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">This Month</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {userAnalytics.drivesThisMonth} drives
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <span className="text-lg font-bold text-accent">
                {userAnalytics.totalParticipants} days
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Total Impact</span>
              </div>
              <span className="text-lg font-bold text-warning">
                {userAnalytics.totalParticipants} people
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="card-eco">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drives by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="all">All Types</option>
                <option value="plantation">Plantation</option>
                <option value="cleanup">Cleanup</option>
                <option value="river-cleaning">River Cleaning</option>
                <option value="awareness">Awareness</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map((drive) => (
          <Card
            key={drive.id}
            className="card-eco hover:shadow-eco transition-all duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(drive.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{drive.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(drive.type)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(drive.status)}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {drive.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{drive.location}</span>
                  <span className="text-xs text-muted-foreground">
                    ({drive.distance} km away)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{drive.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {drive.time} ({drive.duration})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {drive.currentParticipants}/{drive.maxParticipants}{" "}
                    participants
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{drive.contact}</span>
                </div>
              </div>

              {/* Progress Bar for Participants */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Participants</span>
                  <span>
                    {Math.round(
                      (drive.currentParticipants / drive.maxParticipants) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (drive.currentParticipants / drive.maxParticipants) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Points and Requirements */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-sm font-semibold text-warning">
                  <Star className="h-4 w-4 fill-current" />
                  {drive.points} points
                </div>
                <div className="text-xs text-muted-foreground">
                  Organized by {drive.organizer}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  What to bring:
                </p>
                <div className="flex flex-wrap gap-1">
                  {drive.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {drive.status === "upcoming" &&
              drive.currentParticipants < drive.maxParticipants ? (
                <Button
                  className="w-full btn-eco"
                  onClick={() => handleJoinDrive(drive.id)}
                >
                  Join Drive
                </Button>
              ) : drive.status === "ongoing" ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleJoinDrive(drive.id)}
                >
                  Join Now
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Drive Completed
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredDrives.length === 0 && (
        <Card className="card-eco text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Drives Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters to find more community
            drives.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setFilterStatus("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="card-eco text-center bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="py-8">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gradient-eco mb-2">
            Don't See a Drive Near You?
          </h3>
          <p className="text-muted-foreground mb-4">
            Start your own community drive and inspire others to join the
            environmental movement!
          </p>
          <Button className="btn-eco">
            <ExternalLink className="h-4 w-4 mr-2" />
            Create Your Own Drive
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CommunityDrives;
