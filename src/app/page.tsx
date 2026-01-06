'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Check, Clock, Copy, Eye, Send } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [expirationType, setExpirationType] = useState<'views' | 'time'>('views');
  const [expirationValue, setExpirationValue] = useState('10');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          expirationType,
          expirationValue: parseInt(expirationValue),
        }),
      });

      const data = await response.json();
      if (data.id) {
        const link = `${window.location.origin}/view/${data.id}`;
        setGeneratedLink(link);
      }
    } catch {
      alert('Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Share Text Securely
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste your text, set an expiration, and share the link. Once it&apos;s gone, it&apos;s gone forever.
          </p>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>New Paste</CardTitle>
            <CardDescription>
              Enter the text you want to share securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] font-mono text-base resize-none focus-visible:ring-offset-0"
              placeholder="Type your sensitive content here..."
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Expiration Type
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={expirationType === 'views' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setExpirationType('views')}
                  >
                    <Eye className="mr-2 size-4" />
                    Views
                  </Button>
                  <Button
                    type="button"
                    variant={expirationType === 'time' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setExpirationType('time')}
                  >
                    <Clock className="mr-2 size-4" />
                    Time
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {expirationType === 'views' ? 'Max Views' : 'Hours'}
                </label>
                <Input
                  type="number"
                  min="1"
                  value={expirationValue}
                  onChange={(e) => setExpirationValue(e.target.value)}
                  placeholder={expirationType === 'views' ? 'e.g. 10' : 'e.g. 24'}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full text-lg h-12"
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
            >
              {loading ? (
                'Generating...'
              ) : (
                <>
                  Generate Link <Send className="ml-2 size-4" />
                </>
              )}
            </Button>

            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="w-full space-y-2"
              >
                <div className="relative">
                  <Input
                    readOnly
                    value={generatedLink}
                    className="pr-24 h-12 font-mono text-sm bg-muted/50"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1 h-10"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 size-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 size-4" /> Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  This link will expire after{' '}
                  <span className="font-medium text-foreground">
                    {expirationValue} {expirationType === 'views' ? 'views' : 'hours'}
                  </span>
                  .
                </p>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}