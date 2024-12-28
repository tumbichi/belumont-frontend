import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@core/components/ui/avatar';
import { Button } from '@core/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@core/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@core/components/ui/dropdown-menu';
import { InstagramMedia } from '@core/data/instagram/instagram.repository';
import formatDatetime from '@core/utils/formatters/formatDatetime';
import {
  MoveHorizontalIcon,
  BookmarkIcon,
  StarIcon,
  Instagram,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface MediaCardProps {
  media: InstagramMedia;
}

function MediaCard({ media }: MediaCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center p-4">
        <Link
          href="#"
          className="flex items-center gap-2 text-sm font-semibold"
          prefetch={false}
        >
          <Avatar className="w-8 h-8 border">
            <AvatarImage src="/soybelumont-user.jpeg" alt="@shadcn" />
            <AvatarFallback>BM</AvatarFallback>
          </Avatar>
          {media.username}
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
            <a href={media.permalink} target="_blank">
              <DropdownMenuItem>
                <Instagram className="w-4 h-4 mr-2" />
                Ver en Instagram
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          src={media.thumbnail_url ?? '/placeholder.svg'}
          width={350}
          height={620}
          alt="Image"
          className="object-cover aspect-auto"
        />
      </CardContent>
      <CardFooter className="grid gap-2 p-2 pb-4">
        <div className="flex items-center w-full">
          {/*  <Button variant="ghost" size="icon">
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
          </Button> */}
          <p className="px-2 text-sm text-gray-500">
            {formatDatetime(new Date(media.timestamp))}
          </p>
          <Button variant="ghost" size="icon" className="ml-auto">
            <BookmarkIcon className="w-4 h-4" />
            <span className="sr-only">Comment</span>
          </Button>
        </div>
        <div className="px-2 text-sm w-full grid gap-1.5">
          <div>
            <h6 className="mb-1 font-semibold">ID</h6>
            <p>{media.id}</p>
          </div>
          <div>
            <h6 className="mb-1 font-semibold">Tipo</h6>
            <p>{media.media_type}</p>
          </div>
          <div>
            <h6 className="mb-1 font-semibold">Fecha</h6>
            <p> {formatDatetime(new Date(media.timestamp))}</p>
          </div>
          <div className="inline-block">
            <h6 className="mb-1 font-semibold">Descripcion</h6>
            <p className="overflow-hidden text-ellipsis">
              {media.caption.length >= 192
                ? media.caption.slice(0, 192) + '...'
                : media.caption}
            </p>
          </div>
          {/* <div>
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
          </div> */}
        </div>
      </CardFooter>
    </Card>
  );
}

export default MediaCard;
