// complaint_details_page.dart
import 'package:complaint/core/theme/colors.dart';
import 'package:complaint/core/utils/extensions.dart';
import 'package:complaint/data/models/complaint_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../controllers/complaint_controller.dart';
import '../../../core/widgets/loading_widget.dart';

class ComplaintDetailsPage extends StatefulWidget {
  @override
  _ComplaintDetailsPageState createState() => _ComplaintDetailsPageState();
}

class _ComplaintDetailsPageState extends State<ComplaintDetailsPage> {
  final ComplaintController controller = Get.find<ComplaintController>();
  final ScrollController _scrollController = ScrollController();
  bool _showAppBarTitle = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance?.addPostFrameCallback((_) {
      _loadComplaint();
    });

    // Listen to scroll to show/hide app bar title
    _scrollController.addListener(() {
      if (_scrollController.offset > 100 && !_showAppBarTitle) {
        setState(() => _showAppBarTitle = true);
      } else if (_scrollController.offset <= 100 && _showAppBarTitle) {
        setState(() => _showAppBarTitle = false);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _loadComplaint() {
    final arguments = Get.arguments;
    print('=== LOADING COMPLAINT ===');
    print('Arguments type: ${arguments.runtimeType}');
    print('Arguments value: $arguments');

    // الحل: دائماً إعادة تحميل من الـ API للحصول على أحدث البيانات
    if (arguments is Map<String, dynamic>) {
      print('Arguments is Map (JSON)');
      try {
        final complaint = Complaint.fromJson(arguments);
        print('Successfully parsed complaint from JSON: ${complaint.id}');

        // تحميل البيانات من الـ API بدلاً من استخدام البيانات المحلية
        controller.fetchComplaintDetails(complaint.id);
      } catch (e) {
        print('Error parsing complaint from JSON: $e');

        // إذا فشل التحليل، حاول الحصول على الـ ID
        if (arguments.containsKey('complaints_id')) {
          controller.fetchComplaintDetails(
            arguments['complaints_id'].toString(),
          );
        } else if (arguments.containsKey('id')) {
          controller.fetchComplaintDetails(arguments['id'].toString());
        }
      }
    } else if (arguments is String) {
      print('Arguments is String ID: $arguments');
      controller.fetchComplaintDetails(arguments);
    } else if (arguments is Complaint) {
      // إذا كان Complaint object مباشراً
      print('Arguments is Complaint object');
      controller.fetchComplaintDetails(arguments.id);
    } else {
      print('Arguments type not recognized: ${arguments.runtimeType}');

      // Get complaint ID from route parameters
      final parameters = Get.parameters;
      if (parameters.containsKey('id')) {
        print('Found ID in parameters: ${parameters['id']}');
        controller.fetchComplaintDetails(parameters['id']!);
      } else {
        print('No complaint data found in arguments or parameters');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Obx(() {
        if (controller.isLoading.value) {
          return LoadingWidget(message: 'Loading complaint details...');
        }

        final complaint = controller.complaint.value;
        if (complaint == null) {
          return _buildNotFoundState();
        }

        return _buildComplaintDetails(complaint);
      }),
    );
  }

  Widget _buildNotFoundState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off_rounded,
            size: 100,
            color: AppColors.textSecondary.withOpacity(0.5),
          ).animate().scale(duration: 500.ms),
          SizedBox(height: 24),
          Text(
            'Complaint Not Found',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ).animate().fadeIn(duration: 300.ms),
          SizedBox(height: 12),
          Text(
            'The complaint you\'re looking for doesn\'t exist or has been removed',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
          ),
          SizedBox(height: 32),
          ElevatedButton(
            onPressed: () => Get.back(),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 2,
            ),
            child: Text(
              'Go Back',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ).animate().slideY(begin: 0.5, duration: 500.ms),
        ],
      ),
    );
  }

  Widget _buildComplaintDetails(Complaint complaint) {
    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        // App Bar with Hero-like effect
        SliverAppBar(
          expandedHeight: 200,
          floating: false,
          pinned: true,
          backgroundColor: AppColors.background,
          leading: IconButton(
            icon: Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(
                Icons.arrow_back_rounded,
                color: AppColors.textPrimary,
                size: 20,
              ),
            ),
            onPressed: () => Get.back(),
          ),
          actions: [
            // إضافة قائمة منسدلة لخيارات التعديل والحذف
            Obx(() {
              final complaint = controller.complaint.value;
              if (complaint == null) return SizedBox();

              return PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'edit') {
                    _showEditDescriptionDialog(
                      complaint.id.toString(),
                      complaint.description,
                    );
                  } else if (value == 'delete') {
                    _showDeleteConfirmationDialog(complaint.id.toString());
                  }
                },
                itemBuilder: (BuildContext context) {
                  return [
                    PopupMenuItem<String>(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(Icons.edit, color: AppColors.primary, size: 20),
                          SizedBox(width: 8),
                          Text('Edit Description'),
                        ],
                      ),
                    ),
                    PopupMenuItem<String>(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete, color: AppColors.error, size: 20),
                          SizedBox(width: 8),
                          Text('Delete Complaint'),
                        ],
                      ),
                    ),
                  ];
                },
                icon: Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 8,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.more_vert_rounded,
                    color: AppColors.textPrimary,
                    size: 20,
                  ),
                ),
              );
            }),
          ],
          flexibleSpace: FlexibleSpaceBar(
            centerTitle: true,
            title: _showAppBarTitle
                ? Text(
                    'Complaint Details',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ).animate().fadeIn()
                : null,
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.primary.withOpacity(0.1),
                    AppColors.background,
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    right: -50,
                    top: -50,
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.primary.withOpacity(0.05),
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.bottomLeft,
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'REFERENCE',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                              letterSpacing: 1.5,
                            ),
                          ).animate().fadeIn(delay: 100.ms),
                          SizedBox(height: 4),
                          Text(
                            complaint.referenceNumber,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ).animate().fadeIn(delay: 200.ms),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // Main Content
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Badge
                _buildStatusBadge(complaint.status).animate().slideX(
                  begin: -0.5,
                  duration: 500.ms,
                  curve: Curves.easeOut,
                ),

                SizedBox(height: 24),

                // Title with Icon
                Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.description_rounded,
                        color: AppColors.primary,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        complaint.title,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 300.ms),

                SizedBox(height: 32),

                // Quick Info Cards
                _buildQuickInfoCards(complaint).animate().slideY(
                  begin: 0.5,
                  duration: 500.ms,
                  delay: 400.ms,
                  curve: Curves.easeOut,
                ),

                SizedBox(height: 32),

                // Description Card
                _buildDescriptionCard(
                  complaint,
                ).animate().fadeIn(delay: 500.ms),

                SizedBox(height: 32),

                // Location Card
                _buildLocationCard(complaint).animate().fadeIn(delay: 600.ms),

                SizedBox(height: 32),

                // Dates Card
                _buildDatesCard(complaint).animate().fadeIn(delay: 700.ms),

                SizedBox(height: 32),

                // Additional Info Card
                _buildAdditionalInfoCard(
                  complaint,
                ).animate().fadeIn(delay: 800.ms),

                _buildAttachmentsCard(
                  complaint,
                ).animate().fadeIn(delay: 900.ms),

                SizedBox(height: 48),
              ],
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ... بطاقة الحالة والبطاقات الأخرى
                SizedBox(height: 32),

                // Description Card
                _buildDescriptionCard(
                  complaint,
                ).animate().fadeIn(delay: 500.ms),

                SizedBox(height: 32),

                // Notes Card (الجديدة)
                _buildNotesCard(complaint).animate().fadeIn(delay: 600.ms),

                SizedBox(height: 32),

                // Location Card
                _buildLocationCard(complaint).animate().fadeIn(delay: 700.ms),

                // ... بقية البطاقات مع تعديل التأخيرات
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatusBadge(String status) {
    final statusConfig = _getStatusConfig(status);

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: statusConfig.color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: statusConfig.color.withOpacity(0.3),
          width: 1.5,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(statusConfig.icon, color: statusConfig.color, size: 16),
          SizedBox(width: 8),
          Text(
            statusConfig.label,
            style: TextStyle(
              color: statusConfig.color,
              fontWeight: FontWeight.w600,
              fontSize: 14,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  // في complaint_details_page.dart
  Widget _buildQuickInfoCards(Complaint complaint) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            // Category - استخدام اسم النوع بدلاً من الرقم
            _buildInfoRow(
              icon: Icons.category_rounded,
              iconColor: AppColors.primary,
              label: 'Category',
              value: complaint.complaintTypeName.isNotEmpty
                  ? complaint.complaintTypeName
                  : controller.getComplaintTypeName(complaint.complaintType),
            ),
            Divider(height: 24, color: AppColors.border),
            // Priority
            _buildInfoRow(
              icon: Icons.priority_high_rounded,
              iconColor: _getPriorityColor(complaint.priority),
              label: 'Priority',
              value: complaint.priority.toUpperCase(),
            ),
            Divider(height: 24, color: AppColors.border),
            // Government Entity - استخدام اسم الجهة بدلاً من الرقم
            _buildInfoRow(
              icon: Icons.business_rounded,
              iconColor: Colors.blueAccent,
              label: 'Government Entity',
              value: complaint.entityName.isNotEmpty
                  ? complaint.entityName
                  : controller.getEntityName(complaint.entityId),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDescriptionCard(Complaint complaint) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.subject_rounded, color: AppColors.primary, size: 20),
                SizedBox(width: 12),
                Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Text(
              complaint.description.replaceAll('\\n', '\n'),
              style: TextStyle(
                fontSize: 16,
                color: AppColors.textSecondary,
                height: 1.6,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLocationCard(Complaint complaint) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.location_on_rounded,
                  color: Colors.redAccent,
                  size: 20,
                ),
                SizedBox(width: 12),
                Text(
                  'Location',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Text(
                    complaint.location,
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.map_rounded,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatesCard(Complaint complaint) {
    final dateFormat = DateFormat('MMM dd, yyyy - hh:mm a');

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.calendar_today_rounded,
                  color: Colors.blueAccent,
                  size: 20,
                ),
                SizedBox(width: 12),
                Text(
                  'Timeline',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            _buildTimelineItem(
              icon: Icons.add_circle_rounded,
              iconColor: AppColors.success,
              title: 'Created',
              date: dateFormat.format(complaint.createdAt),
            ),
            SizedBox(height: 16),
            if (complaint.updatedAt != null)
              _buildTimelineItem(
                icon: Icons.update_rounded,
                iconColor: AppColors.warning,
                title: 'Last Updated',
                date: dateFormat.format(complaint.updatedAt!),
              ),
            if (complaint.completedAt != null) SizedBox(height: 16),
            if (complaint.completedAt != null)
              _buildTimelineItem(
                icon: Icons.check_circle_rounded,
                iconColor: AppColors.success,
                title: 'Completed',
                date: dateFormat.format(complaint.completedAt!),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdditionalInfoCard(Complaint complaint) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Additional Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 20),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _buildInfoChip(
                  icon: Icons.person_outline_rounded,
                  label: 'Citizen ID',
                  value: complaint.citizenId.toString(),
                ),
                _buildInfoChip(
                  icon: Icons.business_rounded,
                  label: 'Entity',
                  value: complaint.entityName.isNotEmpty
                      ? complaint.entityName
                      : controller.getEntityName(complaint.entityId),
                ),
                _buildInfoChip(
                  icon: Icons.type_specimen_rounded,
                  label: 'Type',
                  value: complaint.complaintTypeName.isNotEmpty
                      ? complaint.complaintTypeName
                      : controller.getComplaintTypeName(
                          complaint.complaintType,
                        ),
                ),
                if (complaint.locked)
                  _buildInfoChip(
                    icon: Icons.lock_rounded,
                    label: 'Status',
                    value: 'Locked',
                    valueColor: AppColors.error,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              SizedBox(height: 4),
              Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // complaint_details_page.dart
  Widget _buildNotesCard(Complaint complaint) {
    // طباعة للمساعدة في التصحيح
    print('=== NOTES DEBUG ===');
    print('Complaint notes length: ${complaint.notes.length}');
    print('Complaint notes: ${complaint.notes}');
    print('Full description: ${complaint.description}');
    print('==================');

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.note_rounded,
                      color: Colors.orangeAccent,
                      size: 20,
                    ),
                    SizedBox(width: 12),
                    Text(
                      'Notes (${complaint.notes.length})',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.add, color: AppColors.primary),
                  onPressed: () {
                    _showAddNoteDialog(complaint.id.toString());
                  },
                ),
              ],
            ),
            SizedBox(height: 16),

            if (complaint.notes.isEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Text(
                  'No notes added yet.',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              )
            else
              ...complaint.notes.asMap().entries.map((entry) {
                final index = entry.key;
                final note = entry.value;
                return _buildNoteItem(note, index, complaint.id.toString());
              }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildNoteItem(String note, int index, String complaintId) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.circle, size: 8, color: AppColors.primary),
                  SizedBox(width: 8),
                  Text(
                    'Note ${index + 1}',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'delete') {}
                },
                itemBuilder: (context) => [
                  PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete, color: AppColors.error, size: 20),
                        SizedBox(width: 8),
                        Text('Delete Note'),
                      ],
                    ),
                  ),
                ],
                icon: Icon(
                  Icons.more_vert,
                  size: 20,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          SizedBox(height: 8),
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Text(
              note,
              style: TextStyle(
                fontSize: 16,
                color: AppColors.textSecondary,
                height: 1.6,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddNoteDialog(String complaintId) {
    final TextEditingController noteController = TextEditingController();

    Get.dialog(
      AlertDialog(
        title: Text('Add Note'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Add a new note to this complaint:'),
            SizedBox(height: 16),
            TextFormField(
              controller: noteController,
              maxLines: 5,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                hintText: 'Enter your note here...',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text(
              'Cancel',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () async {
              final note = noteController.text.trim();
              if (note.isNotEmpty) {
                Get.back();
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  controller.addNoteToComplaint(complaintId, note);
                });
              } else {
                _showErrorMessage('Error', 'Note cannot be empty');
              }
            },
            child: Text('Add Note', style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String date,
  }) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              SizedBox(height: 4),
              Text(
                date,
                style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInfoChip({
    required IconData icon,
    required String label,
    required String value,
    Color valueColor = AppColors.textPrimary,
  }) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: AppColors.textSecondary),
          SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: valueColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showEditDescriptionDialog(
    String complaintId,
    String currentDescription,
  ) {
    final TextEditingController descriptionController = TextEditingController(
      text: currentDescription,
    );

    Get.dialog(
      AlertDialog(
        title: Text('Edit Description'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Update the complaint description:'),
            SizedBox(height: 16),
            TextFormField(
              controller: descriptionController,
              maxLines: 5,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                hintText: 'Enter new description',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text(
              'Cancel',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () async {
              final newDescription = descriptionController.text.trim();
              if (newDescription.isNotEmpty &&
                  newDescription != currentDescription) {
                Get.back();

                // استخدام WidgetsBinding لإضافة تأخير صغير
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  controller.updateComplaintDescription(
                    complaintId,
                    newDescription,
                  );
                });
              } else if (newDescription == currentDescription) {
                Get.back();
                // استخدم SafeSnackbar بدلاً من Get.snackbar
                _showInfoMessage('Info', 'No changes made');
              } else {
                _showErrorMessage('Error', 'Description cannot be empty');
              }
            },
            child: Text('Update', style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  // حوار تأكيد الحذف
  void _showDeleteConfirmationDialog(String complaintId) {
    Get.dialog(
      AlertDialog(
        title: Text('Delete Complaint'),
        content: Text(
          'Are you sure you want to delete this complaint? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text(
              'Cancel',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () async {
              Get.back();

              // استخدام WidgetsBinding لإضافة تأخير صغير
              WidgetsBinding.instance.addPostFrameCallback((_) {
                controller.deleteComplaint(complaintId);
              });
            },
            child: Text('Delete', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  // دوال مساعدة للرسائل
  void _showErrorMessage(String title, String message) {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      try {
        if (Get.context != null) {
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(
              content: Text(message),
              backgroundColor: Colors.red,
              duration: Duration(seconds: 2),
            ),
          );
        }
      } catch (e) {
        print('Error showing message: $e');
      }
    });
  }

  // ثم أضف هذه الدالة لبناء بطاقة المرفقات
  Widget _buildAttachmentsCard(Complaint complaint) {
    return Obx(() {
      final controller = Get.find<ComplaintController>();

      return Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.attach_file, color: AppColors.primary, size: 20),
                  SizedBox(width: 12),
                  Text(
                    'Attachments (${controller.attachments.length})',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),

              if (controller.isLoadingAttachments.value)
                Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                )
              else if (controller.attachments.isEmpty)
                Text(
                  'No attachments available.',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                    fontStyle: FontStyle.italic,
                  ),
                )
              else
                GridView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1,
                  ),
                  itemCount: controller.attachments.length,
                  itemBuilder: (context, index) {
                    final attachment = controller.attachments[index];
                    return _buildAttachmentItem(attachment, index);
                  },
                ),
            ],
          ),
        ),
      );
    });
  }

  Widget _buildAttachmentItem(Map<String, dynamic> attachment, int index) {
    final filePath = attachment['file_path']?.toString() ?? '';
    final fileName = filePath.split('/').last;
    final fileType = attachment['file_type']?.toString() ?? 'png';

    // بناء رابط كامل للصورة
    final cleanPath = filePath.startsWith('/')
        ? filePath.substring(1)
        : filePath;
    final imageUrl = 'http://127.0.0.1:8000/storage/$cleanPath';
    return GestureDetector(
      onTap: () {
        _showImageDialog(imageUrl, fileName);
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
          color: AppColors.background,
        ),
        child: Stack(
          children: [
            // صورة المصغرة
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                imageUrl,
             
                width: double.infinity,
                height: double.infinity,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded /
                                loadingProgress.expectedTotalBytes!
                          : null,
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    color: AppColors.background,
                    child: Icon(
                      _getFileIcon(fileType),
                      size: 40,
                      color: AppColors.primary,
                    ),
                  );
                },
              ),
            ),

            // اسم الملف في الأسفل
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                width: double.infinity,
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(12),
                    bottomRight: Radius.circular(12),
                  ),
                ),
                child: Text(
                  fileName,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    overflow: TextOverflow.ellipsis,
                  ),
                  maxLines: 1,
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showImageDialog(String imageUrl, String fileName) {
    Get.dialog(
      Dialog(
        backgroundColor: Colors.transparent,
        child: Stack(
          children: [
            // صورة كاملة
            Container(
              constraints: BoxConstraints(
                maxWidth: Get.width * 0.9,
                maxHeight: Get.height * 0.8,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  imageUrl,
                  fit: BoxFit.contain,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Center(child: CircularProgressIndicator());
                  },
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.error, size: 50, color: AppColors.error),
                          SizedBox(height: 10),
                          Text('Failed to load image'),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),

            // زر الإغلاق
            Positioned(
              top: 10,
              right: 10,
              child: GestureDetector(
                onTap: () => Get.back(),
                child: Container(
                  padding: EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.5),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.close, color: Colors.white, size: 24),
                ),
              ),
            ),

            // اسم الملف في الأسفل
            Positioned(
              bottom: 10,
              left: 10,
              right: 10,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  fileName,
                  style: TextStyle(color: Colors.white, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getFileIcon(String fileType) {
    switch (fileType.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Icons.image;
      case 'pdf':
        return Icons.picture_as_pdf;
      case 'doc':
      case 'docx':
        return Icons.description;
      case 'xls':
      case 'xlsx':
        return Icons.table_chart;
      default:
        return Icons.insert_drive_file;
    }
  }

  void _showInfoMessage(String title, String message) {
    SchedulerBinding.instance.addPostFrameCallback((_) {
      try {
        if (Get.context != null) {
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(
              content: Text(message),
              backgroundColor: Colors.blue,
              duration: Duration(seconds: 2),
            ),
          );
        }
      } catch (e) {
        print('Error showing message: $e');
      }
    });
  }

  // Helper methods for status and priority
  StatusConfig _getStatusConfig(String status) {
    switch (status) {
      case 'resolved':
        return StatusConfig(
          label: 'Resolved',
          color: AppColors.success,
          icon: Icons.check_circle_rounded,
        );
      case 'in_progress':
        return StatusConfig(
          label: 'In Progress',
          color: AppColors.warning,
          icon: Icons.autorenew_rounded,
        );
      case 'rejected':
        return StatusConfig(
          label: 'Rejected',
          color: AppColors.error,
          icon: Icons.cancel_rounded,
        );
      case 'new':
      default:
        return StatusConfig(
          label: 'New',
          color: Colors.blue,
          icon: Icons.fiber_new_rounded,
        );
    }
  }

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return AppColors.error;
      case 'medium':
        return AppColors.warning;
      case 'low':
        return AppColors.success;
      default:
        return AppColors.textSecondary;
    }
  }
}

class StatusConfig {
  final String label;
  final Color color;
  final IconData icon;

  StatusConfig({required this.label, required this.color, required this.icon});
}
