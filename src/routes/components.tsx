import { createFileRoute } from "@tanstack/react-router";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Badge as BadgeComponent } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/components")({
	component: ComponentsPage,
	head: () => ({
		title: "UI Components - 0xCAL",
	}),
});

function ComponentsPage() {
	const components = [
		{
			name: "Button",
			description: "A clickable button component with various styles and sizes",
			component: (
				<div className="flex gap-2 flex-wrap">
					<Button>Default</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
				</div>
			),
		},
		{
			name: "Badge",
			description: "A small status indicator or label",
			component: (
				<div className="flex gap-2 flex-wrap">
					<BadgeComponent>Default</BadgeComponent>
					<BadgeComponent variant="secondary">Secondary</BadgeComponent>
					<BadgeComponent variant="destructive">Destructive</BadgeComponent>
					<BadgeComponent variant="outline">Outline</BadgeComponent>
				</div>
			),
		},
		{
			name: "Card",
			description: "A container component for grouping related content",
			component: (
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
						<CardDescription>Card description goes here</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Card content with some example text</p>
					</CardContent>
					<CardFooter>
						<Button className="w-full">Action</Button>
					</CardFooter>
				</Card>
			),
		},
		{
			name: "Input",
			description: "A text input field",
			component: (
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="input">Input</Label>
					<Input type="text" id="input" placeholder="Enter text" />
				</div>
			),
		},
		{
			name: "Textarea",
			description: "A multi-line text input field",
			component: (
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="textarea">Textarea</Label>
					<Textarea id="textarea" placeholder="Enter multiple lines of text" />
				</div>
			),
		},
		{
			name: "Checkbox",
			description: "A checkbox for selecting options",
			component: (
				<div className="flex items-center space-x-2">
					<Checkbox id="checkbox" />
					<Label htmlFor="checkbox">Accept terms</Label>
				</div>
			),
		},
		{
			name: "Radio Group",
			description: "A group of radio buttons for single selection",
			component: (
				<RadioGroup defaultValue="option-1">
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="option-1" id="option-1" />
						<Label htmlFor="option-1">Option 1</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="option-2" id="option-2" />
						<Label htmlFor="option-2">Option 2</Label>
					</div>
				</RadioGroup>
			),
		},
		{
			name: "Switch",
			description: "A toggle switch for on/off states",
			component: (
				<div className="flex items-center space-x-2">
					<Switch id="switch" />
					<Label htmlFor="switch">Toggle me</Label>
				</div>
			),
		},
		{
			name: "Slider",
			description: "A range input slider",
			component: (
				<div className="w-[200px]">
					<Slider defaultValue={[50]} max={100} step={1} />
				</div>
			),
		},
		{
			name: "Progress",
			description: "A progress bar indicating completion",
			component: <Progress value={65} className="w-[200px]" />,
		},
		{
			name: "Tabs",
			description: "Tabbed interface for organizing content",
			component: (
				<Tabs defaultValue="tab-1" className="w-[300px]">
					<TabsList>
						<TabsTrigger value="tab-1">Tab 1</TabsTrigger>
						<TabsTrigger value="tab-2">Tab 2</TabsTrigger>
					</TabsList>
					<TabsContent value="tab-1">Tab 1 content</TabsContent>
					<TabsContent value="tab-2">Tab 2 content</TabsContent>
				</Tabs>
			),
		},
		{
			name: "Separator",
			description: "A visual divider between content",
			component: (
				<div>
					<div className="space-y-1">
						<p className="text-sm font-medium leading-none">Item 1</p>
						<p className="text-sm text-muted-foreground">Item description</p>
					</div>
					<Separator className="my-4" />
					<div className="space-y-1">
						<p className="text-sm font-medium leading-none">Item 2</p>
						<p className="text-sm text-muted-foreground">Item description</p>
					</div>
				</div>
			),
		},
		{
			name: "Avatar",
			description: "A user avatar with fallback support",
			component: (
				<Avatar>
					<div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center">
						JD
					</div>
				</Avatar>
			),
		},
		{
			name: "Calendar",
			description: "A date picker calendar component",
			component: (
				<Calendar
					mode="single"
					selected={new Date()}
					className="rounded-md border"
				/>
			),
		},
		{
			name: "Popover",
			description: "A floating overlay component",
			component: (
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline">Open Popover</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="grid gap-4">
							<h4 className="font-medium leading-none">Popover Title</h4>
							<p className="text-sm text-muted-foreground">
								Popover content goes here
							</p>
						</div>
					</PopoverContent>
				</Popover>
			),
		},
		{
			name: "Tooltip",
			description: "A hover tooltip for additional information",
			component: (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">Hover Me</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Tooltip content</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			),
		},
		{
			name: "Sheet",
			description: "A slide-out panel for additional content",
			component: (
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline">Open Sheet</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Sheet Title</SheetTitle>
							<SheetDescription>Sheet description goes here</SheetDescription>
						</SheetHeader>
						<div className="py-4">
							<p>Sheet content</p>
						</div>
					</SheetContent>
				</Sheet>
			),
		},
		{
			name: "Dialog",
			description: "A modal dialog overlay",
			component: (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Open Dialog</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Dialog Title</DialogTitle>
							<DialogDescription>
								Dialog description goes here
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<p>Dialog content</p>
						</div>
					</DialogContent>
				</Dialog>
			),
		},
		{
			name: "Alert",
			description: "An alert message component",
			component: (
				<Alert>
					<AlertTitle>Alert Title</AlertTitle>
					<AlertDescription>
						This is an alert message with important information.
					</AlertDescription>
				</Alert>
			),
		},
		{
			name: "Accordion",
			description: "A collapsible content accordion",
			component: (
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger>Item 1</AccordionTrigger>
						<AccordionContent>Content for item 1</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger>Item 2</AccordionTrigger>
						<AccordionContent>Content for item 2</AccordionContent>
					</AccordionItem>
				</Accordion>
			),
		},
		{
			name: "Table",
			description: "A data table component",
			component: (
				<Table className="w-[400px]">
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>John Doe</TableCell>
							<TableCell>Developer</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Jane Smith</TableCell>
							<TableCell>Designer</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			),
		},
		{
			name: "Skeleton",
			description: "A loading state placeholder",
			component: (
				<div className="flex items-center space-x-4">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-[250px]" />
						<Skeleton className="h-4 w-[200px]" />
					</div>
				</div>
			),
		},
		{
			name: "Scroll Area",
			description: "A scrollable container",
			component: (
				<ScrollArea className="h-[100px] w-[200px] rounded-md border p-4">
					<div className="space-y-2">
						<p className="text-sm">Scrollable content</p>
						<p className="text-sm">More content</p>
						<p className="text-sm">Even more content</p>
					</div>
				</ScrollArea>
			),
		},
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b">
				<div className="container max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								UI Components
							</h1>
							<p className="text-muted-foreground mt-2">
								A comprehensive showcase of all available UI components
							</p>
						</div>
						<Badge variant="secondary">{components.length} Components</Badge>
					</div>
				</div>
			</div>

			{/* Components Grid */}
			<div className="container max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{components.map((item) => (
						<Card key={item.name} className="flex flex-col">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">{item.name}</CardTitle>
									<Badge variant="outline" className="text-xs">
										UI
									</Badge>
								</div>
								<CardDescription className="text-sm">
									{item.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="bg-muted/30 rounded-md p-4 min-h-[100px] flex items-center justify-center">
									{item.component}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Usage Stats */}
				<div className="mt-12 pt-8 border-t">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium">
									Total Components
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{components.length}</div>
								<p className="text-xs text-muted-foreground mt-1">
									Ready-to-use UI components
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium">
									Categories
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">8</div>
								<p className="text-xs text-muted-foreground mt-1">
									Form, Layout, Navigation, Data Display, Feedback, etc.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-medium">Status</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-green-600">
									All Good
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									All components are production-ready
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Additional Info */}
				<div className="mt-12 pt-8 border-t">
					<Card>
						<CardHeader>
							<CardTitle>Component Library Information</CardTitle>
							<CardDescription>
								Details about the UI component library
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h4 className="font-medium mb-2">Available Categories</h4>
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">Form Controls</Badge>
									<Badge variant="secondary">Layout</Badge>
									<Badge variant="secondary">Navigation</Badge>
									<Badge variant="secondary">Data Display</Badge>
									<Badge variant="secondary">Feedback</Badge>
									<Badge variant="secondary">Overlays</Badge>
									<Badge variant="secondary">Media</Badge>
									<Badge variant="secondary">Typography</Badge>
								</div>
							</div>
							<div>
								<h4 className="font-medium mb-2">Key Features</h4>
								<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
									<li>Accessible components with ARIA support</li>
									<li>Customizable with CSS variables</li>
									<li>Built on Radix UI primitives</li>
									<li>TypeScript support</li>
									<li>Responsive design</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
