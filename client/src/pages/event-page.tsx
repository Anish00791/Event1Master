import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Event, Team } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import TeamList from "@/components/team-list";
import { Users, Trophy } from "lucide-react";

export default function EventPage() {
  const [, params] = useRoute("/events/:id");
  const { toast } = useToast();

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

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
        <p className="text-muted-foreground">{event.description}</p>
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
            </dl>

            <Button
              className="mt-4 w-full"
              onClick={() => registerMutation.mutate()}
              disabled={registerMutation.isPending}
            >
              Register for Event
            </Button>
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
            <TeamList teams={teams} eventId={event.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
