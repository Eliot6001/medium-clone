// src/components/modals/InterestsPickingModal.tsx
import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/useStoreModal"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios"

import { Toast } from "../ui/toast"

// your categorization fields
const FIELDS = [
  "Technology", "Culture", "Science", "History", "Geography",
  "Politics", "Economics", "Mathematics", "Literature",
  "Performing Arts", "Visual Arts", "Health & Wellness", "Sports",
  "Business & Finance", "Environment",
]
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const InterestsPickingModal: React.FC = () => {
  const { isOpen, type, onClose, data } = useModal()
  console.log("Test", type)
  const isModalOpen = isOpen && type == "interestsModal"
  const {session} = data;

  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (type === "interestsModal" && Array.isArray(data?.preferred_fields)) {
      setSelected(data.preferred_fields as string[])
    }
  }, [type, data])

  const handleSave = async () => {
    console.log("User picked interests:", session)
    const { data } = await axios.post(`${backendUrl}/profiles/hasInterests`,
      { selected: [...selected] }, // <- this is the body
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
  
    if (data) {
      Toast({
        variant: 'success',
        value: "Successfully updated your interests!"
      });
        
    }
    onClose()
  }
  

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md lg:max-w-[50rem] overflow-hidden dark:bg-[#3a3a3afd] bg-[#e2e2e2] ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle>Pick your interests</DialogTitle>
          <DialogDescription className="text-sm text-accent-foreground/60">The first 3 topics will be prioritized! </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <ToggleGroup
            type="multiple"
            variant="outline"
            className="flex flex-wrap"
            value={selected}
            onValueChange={(v) => setSelected(v)}
          >
            {FIELDS.map((field) => (
              <ToggleGroupItem
                key={field}
                value={field}
                aria-label={field}
                className=""
              >
                {field}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button
            disabled={selected.length === 0}
            onClick={handleSave}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
