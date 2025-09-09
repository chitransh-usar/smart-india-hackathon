import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Upload,
  CheckCircle,
  Clock,
  X,
  MessageSquare,
  Heart,
  Share2,
  TreePine,
  Recycle,
  Droplets,
  Zap,
  Calculator,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommunityWall from "./CommunityWall";
import CarbonCalculator from "./CarbonCalculator";

interface EcoAction {
  id: string;
  studentName: string;
  action: string;
  category: "trees" | "recycling" | "water" | "energy" | "other";
  description: string;
  imageUrl?: string;
  location: string;
  dateSubmitted: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  points: number;
  likes: number;
  comments: number;
}

const PeerValidation = () => {
  const [activeTab, setActiveTab] = useState<
    "submit" | "pending" | "verified" | "calculator"
  >("submit");
  const [selectedAction, setSelectedAction] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const ecoActions: EcoAction[] = [
    {
      id: "1",
      studentName: "Rahul Sharma",
      action: "Planted 5 saplings in school garden",
      category: "trees",
      description:
        "Organized a tree planting drive with my friends during lunch break. We planted neem, mango, and gulmohar saplings in the empty area behind our school.",
      imageUrl: "/placeholder.svg",
      location: "DPS School, Delhi",
      dateSubmitted: "2024-02-20",
      status: "verified",
      verifiedBy: "Ms. Priya (Teacher)",
      points: 50,
      likes: 23,
      comments: 8,
    },
    {
      id: "2",
      studentName: "Ananya Patel",
      action: "Collected 2kg plastic waste for recycling",
      category: "recycling",
      description:
        "Spent my weekend collecting plastic bottles and bags from my neighborhood. Took everything to the local recycling center.",
      location: "Satellite Area, Ahmedabad",
      dateSubmitted: "2024-02-19",
      status: "pending",
      points: 30,
      likes: 15,
      comments: 3,
    },
    {
      id: "3",
      studentName: "Kiran Kumar",
      action: "Fixed water leakage, saved 100L daily",
      category: "water",
      description:
        "Noticed a leaking tap in our school washroom that was wasting lots of water. Reported to maintenance and helped fix it.",
      location: "Vijayanagar School, Bangalore",
      dateSubmitted: "2024-02-18",
      status: "verified",
      verifiedBy: "Peer Review",
      points: 40,
      likes: 31,
      comments: 12,
    },
    {
      id: "4",
      studentName: "Meera Singh",
      action: "LED bulb replacement at home",
      category: "energy",
      description:
        "Convinced my parents to replace all old bulbs with LED ones. This will save electricity and reduce our carbon footprint.",
      location: "Model Town, Ludhiana",
      dateSubmitted: "2024-02-17",
      status: "pending",
      points: 35,
      likes: 8,
      comments: 2,
    },
  ];

  const actionTypes = [
    { id: "trees", label: "Tree Planting", icon: TreePine, points: 50 },
    { id: "recycling", label: "Waste Recycling", icon: Recycle, points: 30 },
    { id: "water", label: "Water Conservation", icon: Droplets, points: 40 },
    { id: "energy", label: "Energy Saving", icon: Zap, points: 35 },
    { id: "other", label: "Other Eco Action", icon: Heart, points: 25 },
  ];

  const handleSubmit = () => {
    if (!selectedAction || !description || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Action Submitted! 🌱",
      description:
        "Your eco-action has been submitted for peer verification. You'll earn points once verified!",
    });

    // Reset form
    setSelectedAction("");
    setDescription("");
    setLocation("");
    setActiveTab("pending");
  };

  const getCategoryIcon = (category: string) => {
    const action = actionTypes.find((a) => a.id === category);
    return action ? action.icon : Heart;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const tabs = [
    { id: "submit" as const, label: "Submit Action", icon: Upload },
    { id: "pending" as const, label: "Pending Review", icon: Clock },
    { id: "verified" as const, label: "Community Wall", icon: CheckCircle },
    { id: "calculator" as const, label: "Calculator", icon: Calculator },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Peer Validation
        </h2>
        <p className="text-muted-foreground">
          Share your real eco-actions, get them verified, and inspire others!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex items-center gap-2 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg"
                  : "hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-sm text-cyan-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon
                className={`h-4 w-4 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-cyan-500 group-hover:text-cyan-600"
                }`}
              />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Submit Action Form */}
      {activeTab === "submit" && (
        <Card className="card-eco">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Submit Your Eco Action
            </h3>
            <p className="text-muted-foreground text-sm">
              Upload proof of your environmental action to earn eco-points and
              inspire others
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="font-semibold">Type of Action</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="What eco-action did you perform?" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      <div className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.label} (+{action.points} points)
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Description</Label>
              <Textarea
                placeholder="Describe what you did, how you did it, and what impact it will have..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Location</Label>
              <Input
                placeholder="Where did you perform this action? (e.g., My School, Local Park)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Upload Proof Photo/Video</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  Click to upload photo or video
                </p>
                <p className="text-xs text-muted-foreground">
                  Show your action in progress or the result. Max file size:
                  10MB
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-4 rounded-xl">
              <h4 className="font-semibold mb-2 text-primary">
                💡 Tips for Better Verification
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Include yourself in the photo to prove participation</li>
                <li>• Show before/after if applicable (like cleaned area)</li>
                <li>• Add location markers or recognizable landmarks</li>
                <li>• Write detailed descriptions of your impact</li>
              </ul>
            </div>

            <Button className="btn-eco w-full" onClick={handleSubmit}>
              Submit for Peer Review
            </Button>
          </div>
        </Card>
      )}

      {/* Pending Actions */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="text-center py-8">
            <Clock className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Your Actions Under Review
            </h3>
            <p className="text-sm text-muted-foreground">
              Actions are typically verified within 24-48 hours by peers or
              teachers
            </p>
          </div>

          {ecoActions
            .filter(
              (action) =>
                action.status === "pending" &&
                action.studentName.includes("You")
            )
            .map((action) => (
              <Card key={action.id} className="card-eco">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-xl flex items-center justify-center">
                    {(() => {
                      const Icon = getCategoryIcon(action.category);
                      return <Icon className="h-6 w-6 text-primary" />;
                    })()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{action.action}</h4>
                      <Badge className={getStatusColor(action.status)}>
                        {action.status}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm mb-3">
                      {action.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{action.location}</span>
                      <span>+{action.points} points pending</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Community Wall - Verified Actions */}
      {activeTab === "verified" && <CommunityWall />}

      {/* Carbon Footprint Calculator */}
      {activeTab === "calculator" && <CarbonCalculator />}
    </div>
  );
};

export default PeerValidation;
