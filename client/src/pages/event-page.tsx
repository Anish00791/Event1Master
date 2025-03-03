import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Event, Team } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TeamList from "@/components/team-list";
import { useAuth } from "@/hooks/use-auth";
import { Users, Trophy, Award, LogOut } from "lucide-react";
import CertificateGenerator from "@/components/certificate-generator";

export default function EventPage() {
  const [, params] = useRoute("/events/:id");
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();

  const { data: event } = useQuery<Event>({
    queryKey: [`/api/events/${params?.id}`],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: [`/api/events/${params?.id}/teams`],
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/events/${params?.id}/register`
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully registered for the event",
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

  if (!event) return null;

  const isOrganizer = user?.role === "organizer";
  const isEventCreator = event.creatorId === user?.id;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <Button variant="outline" onClick={() => logoutMutation.mutate()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium">Start Date</dt>
                <dd>{new Date(event.startDate).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium">End Date</dt>
                <dd>{new Date(event.endDate).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium">Max Team Size</dt>
                <dd>{event.maxTeamSize} members</dd>
              </div>
              {isEventCreator && (
                <div>
                  <dt className="font-medium">Status</dt>
                  <dd className="text-primary">You are the organizer</dd>
                </div>
              )}
            </dl>

            {!isOrganizer && (
              <Button
                className="mt-4 w-full"
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending}
              >
                Register for Event
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TeamList teams={teams} eventId={event.id} isOrganizer={isEventCreator} />
          </CardContent>
        </Card>
      </div>

      {!isOrganizer && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CertificateGenerator event={event} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}