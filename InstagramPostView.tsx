import React from 'react';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@core/components/ui/card';
import Link from 'next/link';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@core/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@core/components/ui/dropdown-menu';
import { Button } from '@core/components/ui/button';

export default function InstagramPostView() {
  return (
    <div className="grid max-w-6xl grid-cols-1 gap-6 p-4 mx-auto md:grid-cols-2 lg:grid-cols-3 md:p-6">
      <Card className="border-0 rounded-none shadow-none">
        <CardHeader className="flex flex-row items-center p-4">
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-semibold"
            prefetch={false}
          >
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            Acme Inc
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 ml-auto rounded-full"
              >
                <MoveHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BookmarkIcon className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StarIcon className="w-4 h-4 mr-2" />
                Add to favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileWarningIcon className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src="/placeholder.svg"
            width={400}
            height={400}
            alt="Image"
            className="object-cover aspect-square"
          />
        </CardContent>
        <CardFooter className="grid gap-2 p-2 pb-4">
          <div className="flex items-center w-full">
            <Button variant="ghost" size="icon">
              <HeartIcon className="w-4 h-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircleIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
            <Button variant="ghost" size="icon">
              <SendIcon className="w-4 h-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto">
              <BookmarkIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
          </div>
          <div className="px-2 text-sm w-full grid gap-1.5">
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                john
              </Link>
              Wow, this photo is absolutely stunning! 😍✨
            </div>
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                amelia
              </Link>
              This post just made my day! 😃👍
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="border-0 rounded-none shadow-none">
        <CardHeader className="flex flex-row items-center p-4">
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-semibold"
            prefetch={false}
          >
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            Acme Inc
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 ml-auto rounded-full"
              >
                <MoveHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BookmarkIcon className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StarIcon className="w-4 h-4 mr-2" />
                Add to favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileWarningIcon className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src="/placeholder.svg"
            width={400}
            height={225}
            alt="Image"
            className="object-cover aspect-video"
          />
        </CardContent>
        <CardFooter className="grid gap-2 p-2 pb-4">
          <div className="flex items-center w-full">
            <Button variant="ghost" size="icon">
              <HeartIcon className="w-4 h-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircleIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
            <Button variant="ghost" size="icon">
              <SendIcon className="w-4 h-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto">
              <BookmarkIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
          </div>
          <div className="px-2 text-sm w-full grid gap-1.5">
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                john
              </Link>
              Wow, this photo is absolutely stunning! 😍✨
            </div>
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                amelia
              </Link>
              This post just made my day! 😃👍
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="border-0 rounded-none shadow-none">
        <CardHeader className="flex flex-row items-center p-4">
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-semibold"
            prefetch={false}
          >
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            Acme Inc
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 ml-auto rounded-full"
              >
                <MoveHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BookmarkIcon className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem>
                <StarIcon className="w-4 h-4 mr-2" />
                Add to favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileWarningIcon className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src="/placeholder.svg"
            width={400}
            height={400}
            alt="Image"
            className="object-cover aspect-square"
          />
        </CardContent>
        <CardFooter className="grid gap-2 p-2 pb-4">
          <div className="flex items-center w-full">
            <Button variant="ghost" size="icon">
              <HeartIcon className="w-4 h-4" />
              <span className="sr-only">Like</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircleIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
            <Button variant="ghost" size="icon">
              <SendIcon className="w-4 h-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto">
              <BookmarkIcon className="w-4 h-4" />
              <span className="sr-only">Comment</span>
            </Button>
          </div>
          <div className="px-2 text-sm w-full grid gap-1.5">
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                john
              </Link>
              Wow, this photo is absolutely stunning! 😍✨
            </div>
            <div>
              <Link href="#" className="font-medium" prefetch={false}>
                amelia
              </Link>
              This post just made my day! 😃👍
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function BookmarkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function FileWarningIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
