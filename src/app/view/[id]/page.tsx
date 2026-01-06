'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Check, Copy, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ViewText() {
  const params = useParams();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<{ maxViews?: number; views: number; isLastView?: boolean; expiresAt?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await fetch(`/api/text/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setText(data.text);
          setInfo(data);
        } else {
          setError(data.error || 'Failed to load text');
        }
      } catch {
        setError('Failed to load text');
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [params.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-24 px-4">
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
          <div className="h-64 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl py-24 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/10 text-destructive p-8 rounded-full mb-6"
        >
          <AlertCircle className="size-12" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Content Unavailable</h1>
        <p className="text-muted-foreground mb-8 text-lg">{error}</p>
        <Button asChild size="lg">
          <Link href="/">Create New Paste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:pl-2 transition-all">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" /> Create New
            </Link>
          </Button>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="size-6 text-primary" />
                Shared Content
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-muted/30 p-6 md:p-8 overflow-x-auto min-h-[200px]">
              <pre className="font-mono text-sm md:text-base whitespace-pre-wrap break-words">{text}</pre>
            </div>
          </CardContent>
          {info && (
            <CardFooter className="bg-muted/50 px-6 py-4 text-sm text-muted-foreground border-t flex flex-wrap gap-4 justify-between">
              <div>
                {info.maxViews && (
                  <span className="flex items-center gap-1">
                    This link expires after <strong>{info.maxViews}</strong> views.
                    (Current: {info.views})
                    {info.isLastView && <span className="text-destructive font-bold ml-1">Last View!</span>}
                  </span>
                )}
              </div>
              <div>
                {info.expiresAt && (
                  <span className="flex items-center gap-1">
                    Expires on {new Date(info.expiresAt).toLocaleString()}
                  </span>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}