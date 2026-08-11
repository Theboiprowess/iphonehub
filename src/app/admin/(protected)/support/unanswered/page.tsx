"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, X, Plus } from "lucide-react";

export default function UnansweredQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [addToKB, setAddToKB] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/support/unanswered?status=PENDING");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) return;

    try {
      const response = await fetch("/api/support/unanswered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedQuestion.id,
          answer,
          addToKB,
        }),
      });

      if (response.ok) {
        setSelectedQuestion(null);
        setAnswer("");
        setAddToKB(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  const handleIgnore = async (id: string) => {
    try {
      const response = await fetch(`/api/support/unanswered/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IGNORED" }),
      });

      if (response.ok) {
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error ignoring question:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unanswered Questions</h1>
          <p className="text-gray-600">Review and answer questions the AI couldn't handle</p>
        </div>
      </div>

      <div className="grid gap-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No unanswered questions</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{question.question}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(question.createdAt).toLocaleString()}
                      {question.category && ` • ${question.category}`}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedQuestion(question)}>
                          <Check className="h-4 w-4 mr-2" />
                          Answer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Answer Question</DialogTitle>
                          <DialogDescription>
                            Provide an answer that will be used to improve the AI's knowledge
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm font-medium mb-2">Question:</p>
                            <p className="text-sm">{selectedQuestion?.question}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Your Answer</label>
                            <Textarea
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              placeholder="Type your answer..."
                              rows={5}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="addToKB"
                              checked={addToKB}
                              onChange={(e) => setAddToKB(e.target.checked)}
                            />
                            <label htmlFor="addToKB" className="text-sm">
                              Add to knowledge base
                            </label>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAnswer}>Submit Answer</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" onClick={() => handleIgnore(question.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
