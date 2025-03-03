import { useState } from "react";
import { Team } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function TeamList({
  teams,
  eventId,
  isOrganizer,
}: {
  teams: Team[];
  eventId: number;
  isOrganizer: boolean;
}) {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiRequest(
        "POST",
        `/api/events/${eventId}/teams`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/teams`],
      });
      setShowCreateTeam(false);
      form.reset();
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <div className="space-y-2">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between p-2 rounded-lg border"
          >
            <div className="flex items-center">
              {team.leaderId === user?.id ? (
                <Shield className="h-4 w-4 mr-2 text-primary" />
              ) : (
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              {team.name}
            </div>
            {!isOrganizer && (
              <Button variant="outline" size="sm">
                {team.leaderId === user?.id ? "Manage Team" : "Join Team"}
              </Button>
            )}
          </div>
        ))}
      </div>

      {!isOrganizer && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowCreateTeam(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Team
        </Button>
      )}

      <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit((data) =>
              createTeamMutation.mutate(data)
            )}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="team-name">Team Name</Label>
              <Input id="team-name" {...form.register("name")} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createTeamMutation.isPending}
            >
              Create Team
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}