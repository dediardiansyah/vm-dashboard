'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor"
import { ImageUpload } from "@/app/components/ui/image-upload"
import { useToastHandler } from "@/app/_hooks/ui/use-toast-handler"
import { Save, ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ISection {
  id: string
  isExpanded: boolean
}

export default function LandingPageCMS() {
  const { showSuccessToast, showErrorToast } = useToastHandler()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedSections, setExpandedSections] = useState<ISection[]>([
    { id: 'hero', isExpanded: true },
    { id: 'features', isExpanded: false },
    { id: 'about', isExpanded: false },
    { id: 'testimonials', isExpanded: false }
  ])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(sections =>
      sections.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    )
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // API call to save the content
      showSuccessToast("Changes saved", "Your changes have been successfully saved.")
    } catch (error) {
      showErrorToast("Error", "Failed to save changes. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur-md pt-6 pb-4 border-b shadow-sm dark:border-border/40">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Landing Page</h1>
          <p className="text-sm text-muted-foreground">Manage your landing page content and layout</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting}
          size="lg"
          className="transition-all hover:scale-105 shadow-sm"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="group transition-all hover:shadow-md border dark:border-border/40 dark:hover:border-border/60">
          <CardHeader 
            className="cursor-pointer transition-colors bg-card hover:bg-accent/40 dark:hover:bg-accent/20"
            onClick={() => toggleSection('hero')}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Hero Section</CardTitle>
                <p className="text-sm text-muted-foreground">Configure your main banner content</p>
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-background/80 dark:bg-background/40">
                {expandedSections.find(s => s.id === 'hero')?.isExpanded 
                  ? <ChevronUp className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                  : <ChevronDown className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                }
              </div>
            </div>
          </CardHeader>
          
          {expandedSections.find(s => s.id === 'hero')?.isExpanded && (
            <CardContent className="space-y-8 p-6 bg-card/50">
              <div className="space-y-2">
                <Label htmlFor="hero-title" className="text-base font-medium">Title</Label>
                <Input 
                  id="hero-title" 
                  placeholder="Enter hero title..." 
                  className="transition-all focus:scale-[1.01] bg-background dark:bg-background/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <WysiwygEditor
                  value=""
                  onChange={() => {}}
                  placeholder="Enter hero subtitle..."
                  fixedHeight={true}
                  initialHeight="100px"
                />
              </div>
              <div className="space-y-2">
                <Label>Background Image</Label>
                <ImageUpload
                  onChange={(file) => console.log(file)}
                  accept="image/*"
                  maxSize={5242880}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="group transition-all hover:shadow-md border dark:border-border/40">
          <CardHeader 
            className="cursor-pointer transition-colors bg-card hover:bg-accent/40 dark:hover:bg-accent/20"
            onClick={() => toggleSection('features')}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Features Section</CardTitle>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-background/80 dark:bg-background/40">
                {expandedSections.find(s => s.id === 'features')?.isExpanded 
                  ? <ChevronUp className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                  : <ChevronDown className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                }
              </div>
            </div>
          </CardHeader>
          {expandedSections.find(s => s.id === 'features')?.isExpanded && (
            <CardContent className="space-y-8 p-6 bg-card/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Features List</Label>
                  <span className="text-sm text-muted-foreground px-2 py-1 rounded-md bg-muted">Drag to reorder</span>
                </div>
                
                <div className="space-y-4">
                  {/* Enhanced Feature Item */}
                  <Card className="border border-dashed hover:border-solid transition-all hover:shadow-sm dark:border-border/60 dark:hover:border-border">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Feature Title</Label>
                            <Input 
                              placeholder="Enter feature title..." 
                              className="bg-background dark:bg-background/80"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <WysiwygEditor
                              value=""
                              onChange={() => {}}
                              placeholder="Enter feature description..."
                              fixedHeight={true}
                              initialHeight="100px"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Feature
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="group transition-all hover:shadow-md border dark:border-border/40">
          <CardHeader 
            className="cursor-pointer transition-colors bg-card hover:bg-accent/40 dark:hover:bg-accent/20"
            onClick={() => toggleSection('about')}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">About Section</CardTitle>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-background/80 dark:bg-background/40">
                {expandedSections.find(s => s.id === 'about')?.isExpanded 
                  ? <ChevronUp className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                  : <ChevronDown className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                }
              </div>
            </div>
          </CardHeader>
          {expandedSections.find(s => s.id === 'about')?.isExpanded && (
            <CardContent className="space-y-8 p-6 bg-card/50">
              <div className="space-y-2">
                <Label htmlFor="about-title" className="text-base font-medium">Section Title</Label>
                <Input 
                  id="about-title" 
                  placeholder="Enter section title..." 
                  className="bg-background dark:bg-background/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-content">Content</Label>
                <WysiwygEditor
                  value=""
                  onChange={() => {}}
                  placeholder="Enter about content..."
                  fixedHeight={true}
                  initialHeight="200px"
                />
              </div>
              <div className="space-y-2">
                <Label>Section Image</Label>
                <ImageUpload
                  onChange={(file) => console.log(file)}
                  accept="image/*"
                  maxSize={5242880}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="group transition-all hover:shadow-md border dark:border-border/40">
          <CardHeader 
            className="cursor-pointer transition-colors bg-card hover:bg-accent/40 dark:hover:bg-accent/20"
            onClick={() => toggleSection('testimonials')}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Testimonials Section</CardTitle>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-background/80 dark:bg-background/40">
                {expandedSections.find(s => s.id === 'testimonials')?.isExpanded 
                  ? <ChevronUp className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                  : <ChevronDown className="h-5 w-5 text-foreground/80 transition-transform group-hover:scale-110" />
                }
              </div>
            </div>
          </CardHeader>
          {expandedSections.find(s => s.id === 'testimonials')?.isExpanded && (
            <CardContent className="space-y-8 p-6 bg-card/50">
              <div className="space-y-2">
                <Label htmlFor="testimonials-title">Section Title</Label>
                <Input id="testimonials-title" placeholder="Enter section title..." />
              </div>
              
              <div className="space-y-4">
                <Label>Testimonials</Label>
                <div className="space-y-4">
                  {/* Testimonial Item */}
                  <Card className="border border-dashed hover:border-solid transition-all hover:shadow-sm dark:border-border/60 dark:hover:border-border">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-4 flex-1">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input placeholder="Enter name..." />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Input placeholder="Enter role..." />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Content</Label>
                            <WysiwygEditor
                              value=""
                              onChange={() => {}}
                              placeholder="Enter testimonial content..."
                              fixedHeight={true}
                              initialHeight="100px"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Avatar</Label>
                            <ImageUpload
                              onChange={(file) => console.log(file)}
                              accept="image/*"
                              maxSize={1048576}
                            />
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Testimonial
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}