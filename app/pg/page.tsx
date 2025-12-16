"use client";

import * as React from "react";
import Link from "next/link";

// Layout components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Input components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Display components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

// Navigation components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Overlay components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import { ChevronRight, Home, Plus } from "lucide-react";

export default function PlaygroundPage() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">UI Components Playground</h1>
          <p className="text-muted-foreground">
            A demonstration of all UI components available in this project.
          </p>
          <Separator />
        </div>

        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="buttons">Buttons & Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards & Layout</TabsTrigger>
            <TabsTrigger value="feedback">Feedback & Display</TabsTrigger>
            <TabsTrigger value="overlay">Overlay Components</TabsTrigger>
            <TabsTrigger value="navigation">Navigation Components</TabsTrigger>
          </TabsList>

          {/* Buttons & Inputs Tab */}
          <TabsContent value="buttons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Different styles of buttons available in the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Icon Button
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input Components</CardTitle>
                <CardDescription>
                  Form input components for capturing user data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" type="email" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms" className="flex items-center gap-2">
                    <Checkbox id="terms" />
                    <span>Accept terms and conditions</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>

                <RadioGroup defaultValue="comfortable">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Comfortable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Compact</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>

                <div className="space-y-2">
                  <Label>Select a fruit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="pear">Pear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards & Layout Tab */}
          <TabsContent value="cards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>
                    Card description providing additional context.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the main content of the card. It can contain any elements.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost">Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Card</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">John Doe</h3>
                    <p className="text-sm text-muted-foreground">Software Developer</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Aspect Ratio</CardTitle>
                <CardDescription>
                  Maintain consistent width-to-height ratio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full max-w-md overflow-hidden rounded-lg">
                  <AspectRatio ratio={16 / 9}>
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800">
                      <p>16/9 Aspect Ratio</p>
                    </div>
                  </AspectRatio>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback & Display Tab */}
          <TabsContent value="feedback" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Status & Indicators</CardTitle>
                <CardDescription>
                  Components for displaying status, progress, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Progress ({progress}%)</Label>
                  <Progress value={progress} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skeletons</h3>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-12 w-[300px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overlay Components Tab */}
          <TabsContent value="overlay" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Dialogs & Popovers</CardTitle>
                <CardDescription>
                  Overlay components for user interactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog example. Dialogs appear over the page and require user interaction.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Dialog content goes here.</p>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>Drawer Title</DrawerTitle>
                        <DrawerDescription>
                          Drawers slide in from the edge of the screen.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <p>Drawer content goes here.</p>
                      </div>
                      <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Dropdown Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="outline">Hover Card</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>VC</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">@vercel</h4>
                        <p className="text-sm">The platform for frontend developers.</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Popover Title</h4>
                        <p className="text-sm text-muted-foreground">
                          Popovers appear next to an element and contain additional information.
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Simple tooltip with additional information</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Components Tab */}
          <TabsContent value="navigation" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Components</CardTitle>
                <CardDescription>
                  Components for page navigation and structure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Breadcrumbs</h3>
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <Home className="h-4 w-4" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Pagination</h3>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
          <p className="text-xs text-muted-foreground">
            UI Components Playground • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
