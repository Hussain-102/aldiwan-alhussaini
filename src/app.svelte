<script>
  // Add JS logic here if needed (e.g. search, filtering)
</script>

<div
  role="menubar"
  class="bg-background flex h-10 w-80 mb-4 items-center gap-2 rounded-md border shadow-xs mx-auto"
  style="outline: none"
  data-slot="menubar"
  data-orientation="horizontal"
>
  <button class="flex justify-center items-center px-3 h-full text-sm leading-none">الرئيسيه</button>
  <button class="flex justify-center items-center px-3 h-full text-sm leading-none">المعصومين</button>
  <button class="flex justify-center items-center px-3 h-full text-sm leading-none">الشعراء</button>
  <button class="flex justify-center items-center px-3 h-full text-sm leading-none">الغرض</button>
</div>

<div class="container mx-auto">
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl text-center mb-4">اىلفىتال</h1>
  </div>
</div>

<div class="container mx-auto p-4">
  <input
    type="search"
    placeholder="ابحث..."
    class="mb-6 file:text-foreground placeholder:text-muted-foreground bg-white selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border  px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    data-slot="input"
  />

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    <button class="bg-white p-6 rounded-xl shadow-sm h-40 relative hover:opacity-70 active:bg-gray-100 border">
      <p class="text-gray-600 mt-2 text-xs absolute top-2 right-2">عدد الابيات 90</p>
      <h2 class="text-lg font text-black">الله ياحامي الشريعة</h2>
      <p class="text-gray-600 mt-2 text-xs">السيد حيدر الحلي</p>
    </button>

    <button class="bg-white p-6 rounded-xl shadow-sm h-40 hover:opacity-70 active:bg-gray-100 border">
      <h2 class="text-lg font text-black">احرم الحجاج</h2>
      <p class="text-gray-600 mt-2 text-xs">الشيخ حسن الدمستاني</p>
    </button>

    <button class="bg-white p-6 rounded-xl shadow-sm h-40 hover:opacity-70 active:bg-gray-100 border">
      <h2 class="font text-black">وجه الصباح علي ليل مظلم</h2>
      <p class="text-gray-600 mt-2 text-xs">السيد جعفر الحلي</p>
    </button>

    <button class="bg-white p-6 rounded-xl shadow-sm h-40 hover:opacity-70 active:bg-gray-100 border">
      <h2 class="text-lg font text-black">أي المحاجر لا تبكي عليك دماً</h2>
      <p class="text-gray-600 mt-2 text-xs">كاظم الازري</p>
    </button>

    <button class="bg-white p-6 rounded-xl shadow-sm h-40 hover:opacity-70 active:bg-gray-100 border">
      <h2 class="text-lg font text-black">جار الزمان عليهم فرماهم بالفادحات</h2>
      <p class="text-gray-600 mt-2 text-xs">السيد مهدي الأعرجي</p>
    </button>
  </div>
</div>

<style>
  :global(body) {
    direction: rtl;
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    background-color: #f9fafb;
  }
</style>
