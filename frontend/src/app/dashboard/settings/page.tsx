"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter, Facebook, Linkedin, Instagram, LinkIcon } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const socialPlatforms = [
    { name: "Twitter/X", icon: Twitter, connected: false, color: "text-sky-500" },
    { name: "Facebook", icon: Facebook, connected: false, color: "text-blue-600" },
    { name: "LinkedIn", icon: Linkedin, connected: false, color: "text-blue-700" },
    { name: "Instagram", icon: Instagram, connected: false, color: "text-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and connected platforms
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-lg">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{session?.user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                defaultValue={session?.user?.name || ""}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={session?.user?.email || ""}
                placeholder="your@email.com"
                disabled
              />
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Platforms</CardTitle>
          <CardDescription>
            Connect your social media accounts to start publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${platform.color}`} />
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {platform.connected
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={platform.connected ? "default" : "secondary"}>
                    {platform.connected ? "Connected" : "Disconnected"}
                  </Badge>
                  <Button
                    variant={platform.connected ? "outline" : "default"}
                    size="sm"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    {platform.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            );
          })}

          <p className="text-xs text-muted-foreground">
            Note: Social media API integrations require platform developer accounts.
            Configure your API keys in the .env file.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
