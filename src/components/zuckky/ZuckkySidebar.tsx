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
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <div className="p-2 flex items-center gap-2">
                <Logo className="h-7 w-7" />
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Zuckky</span>
            </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
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
        <div className="mt-4 px-3 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings2 />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2">
            <UserProfile />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
