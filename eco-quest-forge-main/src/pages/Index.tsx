import { useEffect, useMemo, useState } from "react";
import {
  Leaf,
  Trophy,
  BookOpen,
  Target,
  Calendar,
  Calculator,
  Camera,
  Crown,
  Coins,
  User,
  ArrowRight,
  Users,
  Flame,
  Link as LinkIcon,
  LogOut,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Star,
  Newspaper,
  Menu,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LearningModules from "@/components/LearningModules";
import EcoProgress from "@/components/EcoProgress";
import AchievementBadges from "@/components/AchievementBadges";
import Leaderboard from "@/components/Leaderboard";
import EcoActivityHeatmap from "@/components/EcoActivityHeatmap";
import EcoJournal from "@/components/EcoJournal";
import CarbonCalculator from "@/components/CarbonCalculator";
import PeerValidation from "@/components/PeerValidation";
import EcoChampWeek from "@/components/EcoChampWeek";
import SchoolRecognition from "@/components/SchoolRecognition";
import StudentProfile from "@/components/StudentProfile";
import GreenCoinsWallet from "@/components/GreenCoinsWallet";
import CommunityWall from "@/components/CommunityWall";
import CompeteSection from "@/components/CompeteSection";
import CommunityDrives from "@/components/CommunityDrives";
import EcoTimes from "@/components/EcoTimes";
import { useGreenCoins } from "@/hooks/useGreenCoins";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ecoPoints, setEcoPoints] = useState(1247);
  const { balance: ecoCoins, earnCoins } = useGreenCoins();
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState(12);
  const [showProfile, setShowProfile] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [convertAmount, setConvertAmount] = useState(100);
  const referralCode = `ECO${(user?.id || "123").toString().padStart(3, "0")}`;
  const [totalReferrals, setTotalReferrals] = useState(7);
  const [referralStreakDays, setReferralStreakDays] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [displayReferrals, setDisplayReferrals] = useState(totalReferrals);
  useEffect(() => {
    if (displayReferrals === totalReferrals) return;
    const step = totalReferrals > displayReferrals ? 1 : -1;
    const timer = setInterval(() => {
      setDisplayReferrals((prev) => {
        const next = prev + step;
        if (
          (step > 0 && next >= totalReferrals) ||
          (step < 0 && next <= totalReferrals)
        ) {
          clearInterval(timer);
          return totalReferrals;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [totalReferrals, displayReferrals]);

  const motivationalMessage = useMemo(() => {
    const n = totalReferrals;
    const options = [
      `Together with you, ${n} people are now fighting climate change 🌱`,
      `Every friend you invite makes Earth a little greener 🌍`,
      `Your green squad is growing — you’re leading the change 💪`,
    ];
    return options[n % options.length];
  }, [totalReferrals]);

  const referralGoal = 10;
  const referralPercent = useMemo(
    () =>
      Math.min(
        100,
        Math.round(
          (Math.min(totalReferrals, referralGoal) / referralGoal) * 100
        )
      ),
    [totalReferrals]
  );

  const handleConvertPoints = () => {
    if (convertAmount <= ecoPoints && convertAmount > 0) {
      // Convert points to coins (5 points = 1 coin)
      const coinsToAdd = Math.floor(convertAmount / 5);
      setEcoPoints(ecoPoints - convertAmount);
      earnCoins(coinsToAdd, `Converted ${convertAmount} points to GreenCoins`);
      setShowConvertDialog(false);
      setConvertAmount(100);
    }
  };

  const tabConfig = [
    { id: "dashboard", label: "Dashboard", icon: Target },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "ecotimes", label: "EcoTimes", icon: Newspaper },
    { id: "validation", label: "Share", icon: Camera },
    { id: "community-drives", label: "Community Drives", icon: Users },
    { id: "wallet", label: "Wallet & Store", icon: Coins },
    { id: "compete", label: "Compete", icon: Trophy },
    { id: "journal", label: "Journal", icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "learn":
        return <LearningModules />;
      case "ecotimes":
        return <EcoTimes />;
      case "validation":
        return <PeerValidation />;
      case "community-drives":
        return <CommunityDrives />;
      case "wallet":
        return <GreenCoinsWallet />;
      case "compete":
        return <CompeteSection />;
      case "journal":
        return <EcoJournal />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-eco text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-primary animate-bounce-gentle" />
                </div>
                <h3 className="text-2xl font-bold text-gradient-eco">
                  {ecoPoints}
                </h3>
                <p className="text-muted-foreground">Eco Points</p>
              </Card>

              <Card className="card-eco text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-8 w-8 text-warning animate-glow" />
                </div>
                <h3 className="text-2xl font-bold text-gradient-water">
                  {streak} days
                </h3>
                <p className="text-muted-foreground">Current Streak</p>
              </Card>

              <Card className="card-eco text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-accent animate-float" />
                </div>
                <h3 className="text-2xl font-bold">#3</h3>
                <p className="text-muted-foreground">Class Rank</p>
              </Card>
            </div>

            {/* Progress Overview */}
            <EcoProgress />

            {/* Eco Activity Heatmap */}
            <EcoActivityHeatmap />

            {/* Your Green Network Section */}
            <Card
              className={`card-eco bg-gradient-to-br ${
                totalReferrals >= 10
                  ? "from-emerald-50 to-emerald-100"
                  : totalReferrals >= 5
                  ? "from-green-50 to-green-100"
                  : "from-primary/5 to-primary-glow/10"
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Your Green Network 🌍
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="w-full px-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        Growth to next milestone
                      </div>
                      <div className="h-5 rounded-full bg-emerald-100/60 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-700 ease-out relative"
                          style={{ width: `${referralPercent}%` }}
                        >
                          <div className="absolute inset-y-0 right-1 flex items-center gap-1 pr-1">
                            {Array.from({
                              length: Math.max(
                                1,
                                Math.min(4, Math.ceil(referralPercent / 25))
                              ),
                            }).map((_, i) => (
                              <span
                                key={i}
                                className="text-[10px] animate-pulse"
                              >
                                🌱
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          Milestone:{" "}
                          {totalReferrals >= 10
                            ? "🌍 Planet Protector"
                            : totalReferrals >= 5
                            ? "🌳 Tree Grower"
                            : totalReferrals >= 1
                            ? "🌱 Seed Planter"
                            : "—"}
                        </span>
                        <span>
                          {totalReferrals}/{referralGoal} invites
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1 text-[11px]">
                        {[
                          [1, "Seed Planter", "🌱"],
                          [5, "Tree Grower", "🌳"],
                          [10, "Planet Protector", "🌍"],
                        ].map(([c, l, i]) => (
                          <span
                            key={c as number}
                            className={`px-2 py-1 rounded-full border ${
                              totalReferrals >= (c as number)
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-muted/30 text-muted-foreground border-transparent"
                            }`}
                          >
                            {i as string} {l as string}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <div className="text-2xl font-bold text-gradient-eco">
                      {displayReferrals} New Eco-Warriors Joined Through You
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {motivationalMessage}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Together, you've saved{" "}
                      <span className="font-semibold text-gradient-water">
                        {totalReferrals * 2} kg
                      </span>{" "}
                      of CO₂ 🌍
                    </div>
                    <div className="text-xs text-muted-foreground">{`You're ahead of 85% of students in your school`}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span>
                        {referralStreakDays}-day referral streak, keep it going!
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Rewards:</span>
                      <span>
                        Inviter{" "}
                        <span className="font-semibold text-gradient-eco">
                          +20
                        </span>{" "}
                        GreenCoins
                      </span>
                      <span>•</span>
                      <span>
                        Invitee{" "}
                        <span className="font-semibold text-gradient-water">
                          +10
                        </span>{" "}
                        GreenCoins
                      </span>
                    </div>
                    <div>
                      <Button
                        className="btn-eco mt-2 flex items-center gap-2"
                        onClick={async () => {
                          const shareText = `Join me on EcoQuest! Use my referral code ${referralCode} to sign up. I earn +20 GreenCoins and you get +10! 🌱🌍`;
                          try {
                            if (navigator.share) {
                              await navigator.share({
                                title: "EcoQuest Referral",
                                text: shareText,
                              });
                              return;
                            }
                          } catch {}
                          try {
                            await navigator.clipboard.writeText(shareText);
                          } catch {}
                        }}
                      >
                        <LinkIcon className="h-4 w-4" /> Invite More Friends
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      You're #4 this week — just 2 more invites to reach Top 3
                      🏆
                    </div>
                    {totalReferrals >= 10 && (
                      <div className="mt-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <div className="text-sm font-semibold">
                          Congrats! You’ve built a Green Network of 10 members
                          🌱
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Share this achievement on WhatsApp/Instagram
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="btn-eco"
                            onClick={async () => {
                              const text =
                                "I just became a Planet Protector on EcoQuest with 10 referrals! Join me 🌱";
                              try {
                                if (navigator.share) {
                                  await navigator.share({
                                    title: "EcoQuest Milestone",
                                    text,
                                  });
                                  return;
                                }
                              } catch {}
                              try {
                                await navigator.clipboard.writeText(text);
                              } catch {}
                            }}
                          >
                            Share Achievement
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <AchievementBadges />

            {/* Quick Actions */}
            <Card className="card-eco">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Today's Eco Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="btn-eco justify-start h-auto py-4 px-6">
                  <div className="text-left">
                    <div className="font-semibold">Plant a Tree</div>
                    <div className="text-xs opacity-80">+50 points</div>
                  </div>
                </Button>
                <Button className="btn-earth justify-start h-auto py-4 px-6">
                  <div className="text-left">
                    <div className="font-semibold">Recycle Waste</div>
                    <div className="text-xs opacity-80">+30 points</div>
                  </div>
                </Button>
                <Button className="btn-eco justify-start h-auto py-4 px-6">
                  <div className="text-left">
                    <div className="font-semibold">Water Conservation</div>
                    <div className="text-xs opacity-80">+25 points</div>
                  </div>
                </Button>
                <Button className="btn-earth justify-start h-auto py-4 px-6">
                  <div className="text-left">
                    <div className="font-semibold">Energy Saving</div>
                    <div className="text-xs opacity-80">+40 points</div>
                  </div>
                </Button>
              </div>
            </Card>
          </div>
        );
    }
  };

  // Responsive: show sidebar on mobile, horizontal nav on desktop
  return (
    <div className="min-h-screen relative">
      {/* Eco background gradients and shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main eco gradient */}
        <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 absolute inset-0" />
        {/* Decorative eco shapes */}
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-200 via-green-100 to-transparent opacity-60 blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-blue-200 via-cyan-100 to-transparent opacity-50 blur-2xl animate-pulse-slower" />
        <div className="absolute top-[40%] left-[-80px] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-yellow-100 via-green-50 to-transparent opacity-40 blur-2xl animate-pulse-slowest" />
      </div>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden mr-2 p-2 rounded-full hover:bg-muted/50 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-eco">EcoQuest</h1>
              <p className="text-xs text-muted-foreground">
                Play, Learn, Save the Planet
              </p>
            </div>
          </div>
          {/* ...points, coins, profile button... */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="badge-eco">{ecoPoints} Points</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConvertDialog(true)}
                className="h-6 w-6 p-0 hover:bg-primary/10 rounded-full"
                title="Convert Points to GreenCoins"
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div
              className="badge-water flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setActiveTab("wallet")}
            >
              <Coins className="h-3 w-3" />
              {ecoCoins} GreenCoins
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 hover:bg-muted/50 rounded-full p-2"
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Profile</span>
            </Button>
          </div>
        </div>
      </header>
      {/* Sidebar Drawer for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 md:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      >
        <nav
          className={`fixed top-0 left-0 h-full w-72 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile summary */}
          <div className="p-6 border-b border-muted flex flex-col items-center gap-2 bg-gradient-to-br from-primary/10 to-emerald-50">
            <Avatar className="h-16 w-16 mb-2 ring-4 ring-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl font-bold">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold text-gradient-eco">
              {user?.name || "Student"}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {user?.email || "student@ecolearn.com"}
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {ecoPoints} pts
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {ecoCoins}
              </span>
            </div>
            <button
              className="mt-2 text-sm text-primary underline hover:opacity-80"
              onClick={() => {
                setShowProfile(true);
                setSidebarOpen(false);
              }}
            >
              View Profile
            </button>
          </div>
          {/* Nav links */}
          <div className="flex flex-col gap-1 p-4">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
      {/* Desktop Nav */}
      <div className="container mx-auto px-4 py-6 hidden md:block">
        <div className="w-full flex justify-center">
          <div className="flex gap-2 mb-8 bg-card/50 p-2 rounded-2xl backdrop-blur-sm max-w-6xl w-full justify-center overflow-x-auto">
            {tabConfig.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-eco"
                    : "hover:bg-primary/10 hover:text-primary hover:shadow-sm"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-6">{renderContent()}</div>
      {/* Profile Dialog (unchanged) */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-eco">
              Student Profile
            </DialogTitle>
          </DialogHeader>
          <StudentProfile />
        </DialogContent>
      </Dialog>
      {/* Convert Points Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient-eco">
              Convert Points to GreenCoins
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {ecoPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available Points
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="text-2xl font-bold bg-blue-300 text-white px-6 py-2 rounded-full shadow-eco flex items-center justify-center gap-2">
                    <Coins className="inline h-6 w-6 mr-1 text-white opacity-90" />
                    {Math.floor(convertAmount / 5)} GreenCoins
                  </div>
                  <div className="text-sm text-muted-foreground">
                    GreenCoins
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Exchange Rate: 5 Points = 1 GreenCoin
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="convert-amount">Amount to Convert</Label>
              <Input
                id="convert-amount"
                type="number"
                min="1"
                max={ecoPoints}
                value={convertAmount}
                onChange={(e) => setConvertAmount(Number(e.target.value))}
                className="text-center text-lg font-semibold"
              />
              <div className="text-xs text-muted-foreground text-center">
                You will receive {Math.floor(convertAmount / 5)} GreenCoins
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConvertPoints}
                disabled={convertAmount <= 0 || convertAmount > ecoPoints}
                className="flex-1 btn-eco"
              >
                Convert Points
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConvertDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
