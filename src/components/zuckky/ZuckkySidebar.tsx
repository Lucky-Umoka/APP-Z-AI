'use client';

import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { MessageSquarePlus, MessageSquareText, Settings2 } from 'lucide-react';
import Logo from './Logo';
import { UserProfile } from './UserProfile';

export function ZuckkySidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <Logo className="h-7 w-7 shrink-0" />
            <span className="truncate text-lg font-semibold group-data-[collapsible=icon]:hidden">
              Zuckky
            </span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => window.location.reload()}
              className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
              tooltip="New Video"
            >
              <MessageSquarePlus />
              <span className="group-data-[collapsible=icon]:hidden">New Video</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 px-2 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
          Recent
        </div>
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton isActive={true} tooltip="Viral Clip Edit">
              <MessageSquareText />
              <span className="group-data-[collapsible=icon]:hidden">Viral Clip Edit</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Podcast Highlights">
              <MessageSquareText />
              <span className="group-data-[collapsible=icon]:hidden">Podcast Highlights</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings2 />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-2">
          <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
