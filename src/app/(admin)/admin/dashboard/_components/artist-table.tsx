"use client"
import React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import Image from "next/image"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EditArtistSheet } from "./edit-artist-sheet"
import { useState } from "react"

// Interface for artist data
interface Artist {
  id: string
  name: string
  spotifyFollowers: number
  monthlyListeners: number
  youtubeSubscribers: number
  instagramFollowers: number
  popularity: number
  imageUrl?: string
  country?: string
  genres?: string[]
  facebookFollowers: number
  tiktokFollowers: number
}

export function ArtistMetricsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Artist[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const columns: ColumnDef<Artist>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Artist
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-md overflow-hidden">
            <Image 
              src={row.original.imageUrl || "/images/placeholder.jpg"}
              alt={row.getValue("name")}
              width={44}
              height={44}
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {row.original.country && (
                <div className="flex items-center gap-1.5">
                  <Image
                    src={`/flags/${row.original.country.toLowerCase()}.svg`}
                    alt={row.original.country}
                    width={16}
                    height={12}
                    className="rounded-sm"
                  />
                  <span>{row.original.country}</span>
                </div>
              )}
              </div>
              {row.original.genres && (
                <div className="text-xs">
                  {row.original.genres.slice(0, 2).join(", ")}
                  {row.original.genres.length > 2 && "..."}
                </div>
              )}
            </div>
        </div>
      ),
    },
    {
      accessorKey: "spotifyFollowers",
      header: () => (
        <div className="flex items-center justify-end gap-2">
          <Image
            src="/images/spotify.svg"
            alt="Spotify"
            width={16}
            height={16}
          />
          <span>Followers</span>
        </div>
      ),
      cell: ({ row }) => {
        const followers = parseInt(row.getValue("spotifyFollowers"))
        const formatted = new Intl.NumberFormat().format(followers)
        return (
          <div className="flex items-center justify-end gap-2">
          <span className="font-medium">{formatted}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "monthlyListeners",
      header: () => (
        <div className="flex items-center justify-end gap-2">
          <Image
            src="/images/spotify.svg"
            alt="Spotify"
            width={16}
            height={16}
          />
          <span>Monthly <br /> Listeners</span>
        </div>
      ),
      cell: ({ row }) => {
        const listeners = parseInt(row.getValue("monthlyListeners"))
        const formatted = new Intl.NumberFormat().format(listeners)
        return (
          <div className="flex items-center justify-end gap-2">
            <span className="font-medium">{formatted}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "popularity",
      header: () => (
          <div className="flex items-center justify-end gap-2">
            <Image
              src="/images/spotify.svg"
              alt="Spotify"
              width={16}
              height={16}
            />
            <span>Popularity</span>
          </div>
        ),
      cell: ({ row }) => {
        const popularity = parseInt(row.getValue("popularity"))
        return (
          <div className="text-right font-medium">
            {popularity}
            <span className="text-xs text-muted-foreground ml-1">/100</span>
          </div>
        )
      },
    },
    {
      accessorKey: "youtubeSubscribers",
      header: () => (
          <div className="flex items-center justify-end gap-2">
            <Image
              src="/images/youtube-alt.svg"
              alt="Spotify"
              width={16}
              height={16}
            />
            <span>Subscribers</span>
          </div>
        ),
      cell: ({ row }) => {
        const subscribers = parseInt(row.getValue("youtubeSubscribers"))
        const formatted = new Intl.NumberFormat().format(subscribers)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "instagramFollowers",
      header: () => (
          <div className="flex items-center justify-end gap-2">
            <Image
              src="/images/instagram-alt.bb84a5f1.svg"
              alt="Instagram"
              width={16}
              height={16}
            />
            <span>Followers</span>
          </div>
        ),
      cell: ({ row }) => {
        const followers = parseInt(row.getValue("instagramFollowers"))
        const formatted = new Intl.NumberFormat().format(followers)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "facebookFollowers",
      header: () => (
        <div className="flex items-center justify-end gap-2">
          <Image
            src="/images/facebook.svg"
            alt="Facebook"
            width={16}
            height={16}
          />
          <span>Followers</span>
        </div>
      ),
      cell: ({ row }) => {
        const followers = parseInt(row.getValue("facebookFollowers"))
        const formatted = new Intl.NumberFormat().format(followers)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "tiktokFollowers",
      header: () => (
        <div className="flex items-center justify-end gap-2">
          <Image
            src="/images/tiktok.svg"
            alt="TikTok"
            width={16}
            height={16}
          />
          <span>Followers</span>
        </div>
      ),
      cell: ({ row }) => {
        const followers = parseInt(row.getValue("tiktokFollowers"))
        const formatted = new Intl.NumberFormat().format(followers)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const artist = row.original
 
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(artist.id)}
              >
                Copy artist ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedArtist(artist)
                setSheetOpen(true)
              }}>
                Edit artist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  React.useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artists')
        const result = await response.json()
        setData(result.artists)
      } catch (error) {
        console.error('Failed to fetch artists:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading artists...</div>
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter artists..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No artists found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <EditArtistSheet 
        artist={selectedArtist}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}