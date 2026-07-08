"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getContactMessages, deleteContactMessage, markContactMessageAsRead } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading contact messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markContactMessageAsRead(id);
      toast({
        title: 'Success',
        description: 'Message marked as read',
      });
      loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark message as read',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete message from "${name}"?`)) return;

    try {
      await deleteContactMessage(id);
      toast({
        title: 'Success',
        description: 'Contact message deleted successfully',
      });
      loadMessages();
    } catch (error) {
      console.error('Error deleting contact message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact message',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-cyan-400">Contact Messages</h2>
          <p className="text-slate-400 mt-2">View and manage messages from your contact form</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              When someone submits the contact form, their messages will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{message.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={message.read ? "default" : "secondary"}>
                        {message.read ? (
                          <>
                            <MailOpen className="mr-1 h-3 w-3" />
                            Read
                          </>
                        ) : (
                          <>
                            <Mail className="mr-1 h-3 w-3" />
                            Unread
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {new Date(message.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!message.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMessage(message.id, message.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="text-muted-foreground ml-2">{message.email}</span>
                  </div>
                  <div>
                    <span className="font-medium">Message:</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
